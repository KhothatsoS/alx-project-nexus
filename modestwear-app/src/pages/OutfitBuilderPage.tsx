"use client";

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootState } from '@/store/store';
import { addItemToOutfit, removeItemFromOutfit, updateItemPosition, clearOutfit, saveOutfit, loadOutfit, deleteOutfit,} from '@/store/slices/outfitBuilderSlice';
import { Products } from '@/data/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sparkles, Trash2, Save, FolderOpen, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ItemTypes = {
  PRODUCT: 'product',
  OUTFIT_ITEM: 'outfit_item',
};

interface DraggableProductProps {
  product: any;
}

function DraggableProduct({ product }: DraggableProductProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PRODUCT,
    item: { product },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
    ref={(node) => {
    if (node) drag(node);
    }}
    className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
    >

      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-2">
          <p className="text-xs line-clamp-1">{product.name}</p>
          <p className="text-xs text-accent">R{product.price}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface OutfitItemProps {
  item: any;
  onRemove: () => void;
}

function OutfitItem({ item, onRemove }: OutfitItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.OUTFIT_ITEM,
    item: { id: item.product.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
     ref={(node) => {
     if (node) drag(node);
      }}
      className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
        zIndex: item.layer,
      }}
    >
      <div className="relative group">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-32 h-48 object-cover rounded-lg shadow-lg"
        />
        <Button
          size="icon"
          variant="destructive"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={onRemove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function OutfitBuilderPage() {
  const dispatch = useDispatch();
  const currentOutfit = useSelector((state: RootState) => state.outfitBuilder.currentOutfit);
  const savedOutfits = useSelector((state: RootState) => state.outfitBuilder.savedOutfits);
  const dropRef = useRef<HTMLDivElement>(null);

  const [outfitName, setOutfitName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const productsByCategory = selectedCategory === 'all'
    ? Products
    : Products.filter((p) => p.category === selectedCategory);

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.PRODUCT, ItemTypes.OUTFIT_ITEM],
    drop: (item: any, monitor) => {
      if (!dropRef.current) return;

      const offset = monitor.getClientOffset();
      const canvasRect = dropRef.current.getBoundingClientRect();

      if (offset) {
        const x = ((offset.x - canvasRect.left) / canvasRect.width) * 100;
        const y = ((offset.y - canvasRect.top) / canvasRect.height) * 100;

        if (item.product) {
          // New product from sidebar
          dispatch(addItemToOutfit({ product: item.product }));
        } else if (item.id) {
          // Existing item being moved
          dispatch(updateItemPosition({ productId: item.id, position: { x, y } }));
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleSaveOutfit = () => {
    if (!outfitName.trim()) {
      toast.error('Please enter an outfit name');
      return;
    }
    dispatch(saveOutfit(outfitName));
    toast.success('Outfit saved successfully');
    setOutfitName('');
    setSaveDialogOpen(false);
  };

  const handleLoadOutfit = (outfitId: string) => {
    dispatch(loadOutfit(outfitId));
    toast.success('Outfit loaded');
    setLoadDialogOpen(false);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    dispatch(deleteOutfit(outfitId));
    toast.success('Outfit deleted');
  };

  const handleClearCanvas = () => {
    dispatch(clearOutfit());
    toast.success('Canvas cleared');
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'abayas', name: 'Abayas' },
    { id: 'tops', name: 'Tops' },
    { id: 'bottoms', name: 'Bottoms' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'accessories', name: 'Accessories' },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
              <h1 className="text-3xl md:text-4xl">Outfit Builder</h1>
            </div>
            <p className="text-muted-foreground">
              Drag and drop items to create your perfect modest outfit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Product Library */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-4">Product Library</h3>

                  {/* Category Filter */}
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="dresses">Dresses</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-2 gap-3">
                      {productsByCategory.slice(0, 20).map((product) => (
                        <DraggableProduct key={product.id} product={product} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={currentOutfit.length === 0}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Outfit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Outfit</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="outfit-name" className="mb-2 block">
                            Outfit Name
                          </Label>
                          <Input
                            id="outfit-name"
                            value={outfitName}
                            onChange={(e) => setOutfitName(e.target.value)}
                            placeholder="e.g., Summer Casual"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSaveOutfit}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Load Outfit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Saved Outfits</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] py-4">
                          {savedOutfits.length > 0 ? (
                            <div className="space-y-2">
                              {savedOutfits.map((outfit) => (
                                <Card key={outfit.id}>
                                  <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                      <h4 className="mb-1">{outfit.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(outfit.createdAt).toLocaleDateString()} •{' '}
                                        {outfit.items.length} items
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleLoadOutfit(outfit.id)}
                                      >
                                        Load
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteOutfit(outfit.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-8">
                              No saved outfits yet
                            </p>
                          )}
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      onClick={handleClearCanvas}
                      disabled={currentOutfit.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Canvas
                    </Button>

                    <Button
                      variant="outline"
                      disabled={currentOutfit.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Image
                    </Button>
                  </div>

                  {/* Canvas Area */}
                  <div
                   ref={(node) => {
                   drop(node);
                   dropRef.current = node;
                    }}
                    className={`relative w-full aspect-[3/4] rounded-lg border-2 border-dashed ${
                      isOver ? 'border-accent bg-accent/5' : 'border-border'
                    } transition-colors`}
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1618220179428-22790b461013?w=800)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {currentOutfit.length === 0 && !isOver && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <Plus className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">Drag items here to start building your outfit</p>
                      </div>
                    )}

                    {currentOutfit.map((item) => (
                      <OutfitItem
                        key={item.product.id}
                        item={item}
                        onRemove={() => dispatch(removeItemFromOutfit(item.product.id))}
                      />
                    ))}
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="mb-2">How to use:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag products from the library onto the canvas</li>
                      <li>• Move items around by dragging them on the canvas</li>
                      <li>• Remove items by clicking the trash icon</li>
                      <li>• Save your favorite outfits to load them later</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Desktop: Resizable Layout */}
            <div className="hidden lg:block">
              <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                {/* Left Panel - Product Library */}
                <ResizablePanel defaultSize="25%" minSize="20%" maxSize="40%" direction="horizontal">
                  <Card className="h-full border-0 rounded-none">
                    <CardContent className="p-4 h-full flex flex-col">
                      <h3 className="mb-4">Product Library</h3>

                      {/* Category Filter */}
                      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
                        <TabsList className="w-full grid grid-cols-2">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="dresses">Dresses</TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <ScrollArea className="flex-1">
                        <div className="grid grid-cols-2 gap-3 pr-4">
                          {productsByCategory.slice(0, 20).map((product) => (
                            <DraggableProduct key={product.id} product={product} />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                {/* Resize Handle */}
                <ResizableHandle withHandle direction="horizontal" />

                {/* Right Panel - Canvas */}
                <ResizablePanel defaultSize="75%" minSize="60%" maxSize="80%" direction="horizontal">
                  <Card className="h-full border-0 rounded-none">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Toolbar */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                          <DialogTrigger asChild>
                            <Button disabled={currentOutfit.length === 0}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Outfit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Save Outfit</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="outfit-name" className="mb-2 block">
                                Outfit Name
                              </Label>
                              <Input
                                id="outfit-name"
                                value={outfitName}
                                onChange={(e) => setOutfitName(e.target.value)}
                                placeholder="e.g., Summer Casual"
                              />
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSaveOutfit}>Save</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Load Outfit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Saved Outfits</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[400px] py-4">
                              {savedOutfits.length > 0 ? (
                                <div className="space-y-2">
                                  {savedOutfits.map((outfit) => (
                                    <Card key={outfit.id}>
                                      <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                          <h4 className="mb-1">{outfit.name}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(outfit.createdAt).toLocaleDateString()} •{' '}
                                            {outfit.items.length} items
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            onClick={() => handleLoadOutfit(outfit.id)}
                                          >
                                            Load
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteOutfit(outfit.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-center py-8">
                                  No saved outfits yet
                                </p>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          onClick={handleClearCanvas}
                          disabled={currentOutfit.length === 0}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Canvas
                        </Button>

                        <Button
                          variant="outline"
                          disabled={currentOutfit.length === 0}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Image
                        </Button>
                      </div>

                      {/* Canvas Area */}
                      <div className="flex-1 flex items-center justify-center">
                        <div
                          ref={(node) => {
                            drop(node);
                            if (node) {
                              (canvasRef as any).current = node;
                            }
                          }}
                          className={`relative w-full max-w-2xl aspect-[3/4] rounded-lg border-2 border-dashed ${
                            isOver ? 'border-accent bg-accent/5' : 'border-border'
                          } transition-colors`}
                          style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1618220179428-22790b461013?w=800)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          {currentOutfit.length === 0 && !isOver && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                              <Plus className="h-16 w-16 mb-4 opacity-50" />
                              <p className="text-lg">Drag items here to start building your outfit</p>
                            </div>
                          )}

                          {currentOutfit.map((item) => (
                            <OutfitItem
                              key={item.product.id}
                              item={item}
                              onRemove={() => dispatch(removeItemFromOutfit(item.product.id))}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="mb-2">How to use:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Drag products from the library onto the canvas</li>
                          <li>• Move items around by dragging them on the canvas</li>
                          <li>• Remove items by clicking the trash icon</li>
                          <li>• Save your favorite outfits to load them later</li>
                          <li>• <strong>Drag the divider</strong> to resize the panels</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </div>
    </DndProvider>
  );
}