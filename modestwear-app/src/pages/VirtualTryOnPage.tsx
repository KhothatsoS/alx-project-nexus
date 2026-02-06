"use client";

import { useState, useRef, useEffect } from "react";
import { Products } from "@/data/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableBox } from '@/components/ui/resizable';
import { Sparkles, Upload, Download, RefreshCcw, } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function VirtualTryOnPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    scale: 100,
    rotation: 0,
    positionX: 50,
    positionY: 50,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Selected ${product.name}`);
  };

  // Reset adjustments
  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      scale: 100,
      rotation: 0,
      positionX: 50,
      positionY: 50,
    });
  };

  // Use demo image
  const useDemoImage = () => {
    setUploadedImage(
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800"
    );
    toast.success("Demo model loaded");
  };

  

  // Export final composition
  const handleExport = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current);
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "virtual-tryon.png";
      link.click();
      toast.success("Image exported successfully!");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  // Handle draggable overlay
  const handleDrag = (e: React.MouseEvent) => {
    if (!selectedProduct || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setAdjustments((prev) => ({
      ...prev,
      positionX: Math.min(Math.max(x, 0), 100),
      positionY: Math.min(Math.max(y, 0), 100),
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-3xl md:text-4xl">Virtual Try-On</h1>
          </div>
          <p className="text-muted-foreground">
            Upload your photo and see how our modest fashion looks on you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Product Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4">Select Product</h3>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {Products.slice(0, 10).map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow ${
                          selectedProduct?.id === product.id
                            ? "ring-2 ring-accent"
                            : ""
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="aspect-square overflow-hidden bg-muted rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm line-clamp-1 mb-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-accent">${product.price}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Try-On Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Area */}
                  <div>
                    <h3 className="mb-4">Your Photo</h3>
                    <div
                      className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center"
                    >
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                          style={{
                            filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                          }}
                        />
                      ) : (
                        <div className="text-center p-8">
                          <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-4">
                            Upload your photo to start
                          </p>
                          <div className="space-y-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Button onClick={() => fileInputRef.current?.click()}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </Button>
                            <p className="text-xs text-muted-foreground">or</p>
                            <Button variant="outline" onClick={useDemoImage}>
                              Use Demo Model
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview with Product */}
                  <div>
                    <h3 className="mb-4">Preview</h3>
                    <div
                      ref={previewRef}
                      className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted border-2 border-border cursor-crosshair"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const move = (ev: MouseEvent) => handleDrag(ev as any);
                        document.addEventListener("mousemove", move);
                        document.addEventListener("mouseup", () => {
                          document.removeEventListener("mousemove", move);
                        });
                      }}
                    >
                      {uploadedImage && (
                        <>
                          {/* Base Image */}
                          <img
                            src={uploadedImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{
                              filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                            }}
                          />
                          {/* Overlay Product */}
                          {selectedProduct && (
                            <div
                              className="absolute cursor-move"
                              style={{
                                left: `${adjustments.positionX}%`,
                                top: `${adjustments.positionY}%`,
                                transform: `translate(-50%, -50%) scale(${
                                  adjustments.scale / 100
                                }) rotate(${adjustments.rotation}deg)`,
                                opacity: 0.9,
                              }}
                            >
                              <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {uploadedImage && selectedProduct && (
                      <div className="mt-4 flex gap-2">
                        <Button onClick={handleExport}>
                          <Download className="h-4 w-4 mr-2" />
                          Save Image
                        </Button>
                        <Button variant="outline" onClick={resetAdjustments}>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview with Product - Resizable */}
                  <div>
                    <h3 className="mb-4">Preview (Drag bottom-right corner to resize)</h3>
                    <ResizableBox
                      defaultWidth="100%"
                      defaultHeight={600}
                      minWidth={300}
                      minHeight={400}
                      maxWidth="100%"
                      maxHeight={800}
                      enable={{
                        top: false,
                        right: true,
                        bottom: true,
                        left: false,
                        topRight: false,
                        bottomRight: true,
                        bottomLeft: false,
                        topLeft: false,
                      }}
                      className="rounded-lg overflow-hidden bg-muted border-2 border-border"
                    >
                      {uploadedImage ? (
                        <div className="relative w-full h-full">
                          {/* Base Image */}
                          <img
                            src={uploadedImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{
                              filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                            }}
                          />

                          {/* Overlay Product */}
                          {selectedProduct && (
                            <div
                              className="absolute"
                              style={{
                                left: `${adjustments.positionX}%`,
                                top: `${adjustments.positionY}%`,
                                transform: `translate(-50%, -50%) scale(${adjustments.scale / 100}) rotate(${adjustments.rotation}deg)`,
                                opacity: 0.9,
                              }}
                            >
                              <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Upload a photo to see preview</p>
                        </div>
                      )}
                    </ResizableBox>
                  </div>

                {/* Adjustment Controls */}
                {uploadedImage && selectedProduct && (
                  <div className="mt-8">
                    <h3 className="mb-6">Adjustments</h3>
                    <Tabs defaultValue="position" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="position">Position</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="transform">Transform</TabsTrigger>
                      </TabsList>

                      <TabsContent value="position" className="space-y-6 pt-6">
                        <div>
                          <Label className="mb-2 block">Horizontal Position</Label>
                          <Slider
                            value={[adjustments.positionX]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, positionX: value })
                            }
                            max={100}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Vertical Position</Label>
                          <Slider
                            value={[adjustments.positionY]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, positionY: value })
                            }
                            max={100}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="appearance" className="space-y-6 pt-6">
                        <div>
                          <Label className="mb-2 block">
                            Brightness: {adjustments.brightness}%
                          </Label>
                          <Slider
                            value={[adjustments.brightness]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, brightness: value })
                            }
                            max={200}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">
                            Contrast: {adjustments.contrast}%
                          </Label>
                          <Slider
                            value={[adjustments.contrast]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, contrast: value })
                            }
                            max={200}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">
                            Saturation: {adjustments.saturation}%
                          </Label>
                          <Slider
                            value={[adjustments.saturation]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, saturation: value })
                            }
                            max={200}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="transform" className="space-y-6 pt-6">
                        <div>
                          <Label className="mb-2 block">Scale: {adjustments.scale}%</Label>
                          <Slider
                            value={[adjustments.scale]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, scale: value })
                            }
                            min={50}
                            max={150}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">
                            Rotation: {adjustments.rotation}°
                          </Label>
                          <Slider
                            value={[adjustments.rotation]}
                            onValueChange={([value]) =>
                              setAdjustments({ ...adjustments, rotation: value })
                            }
                            min={-45}
                            max={45}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
                {/* Information Panel */}
                <div className="mt-8 p-6 bg-muted rounded-lg">
                  <h4 className="mb-3">How to use Virtual Try-On:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      1. Upload a full-body photo or use our demo model (best results with plain
                      background)
                    </li>
                    <li>2. Select a product from the sidebar that you want to try on</li>
                    <li>
                      3. Adjust the position, size, and rotation to match your photo perfectly
                    </li>
                    <li>4. Fine-tune the appearance settings for the best visual match</li>
                    <li>5. Save or share your virtual try-on result</li>
                  </ul>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm">
                      <strong>Note:</strong> This is a basic overlay demonstration. For production,
                      integrate with AI-powered virtual try-on APIs like [API: POST /virtual-try-on]
                      for realistic results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
