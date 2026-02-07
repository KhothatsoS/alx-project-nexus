import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Products, Orders } from '@/data/data';
import { ResizableBox } from '@/components/ui/resizable';
import { LineChart, BarChart, DoughnutChart  } from '@/components/ui/chart';
import { Package, ShoppingBag, Users, TrendingUp, Eye, Edit, Trash2, LucideIcon} from 'lucide-react';

// [API: GET /admin/stats] - Get dashboard statistics
// [API: GET /admin/products] - Get all products
// [API: GET /admin/orders] - Get all orders
// [API: GET /admin/users] - Get all users

export default function AdminDashboard() {
  const totalRevenue = Orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = Orders.length;
  const totalProducts = Products.length;

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#C9A24D',
        backgroundColor: 'rgba(201, 162, 77, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: ['Dresses', 'Abayas', 'Tops', 'Bottoms', 'Accessories'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [45, 30, 20, 15, 10],
        backgroundColor: [
          '#C9A24D',
          '#E63946',
          '#111827',
          '#F5EFE7',
          '#6B7280',
        ],
      },
    ],
  };

  const ordersChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: '#C9A24D',
      },
    ],
  };

  type stats = {
  title: string;
  value: string;
  change: string;
  color: string;
  icon?: LucideIcon; 
};


  const stats = [
  {
    title: 'Total Revenue',
    value: new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(totalRevenue),
    change: '+12.5%',
    color: 'text-green-600',
  },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      change: '+8.2%',
      color: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      change: '+3.1%',
      color: 'text-purple-600',
    },
    {
      title: 'Total Customers',
      value: '1,234',
      icon: Users,
      change: '+15.3%',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your ModestWear store</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {stat.icon && <stat.icon className={`h-8 w-8 ${stat.color}`} />}
                  <span className={`text-sm ${stat.color}`}>
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3>Products Management</h3>
                  <Button>Add New Product</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Product</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-left py-3 px-2">Price</th>
                        <th className="text-left py-3 px-2">Stock</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Products.slice(0, 5).map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 capitalize">{product.category}</td>
                          <td className="py-3 px-2">R{product.price}</td>
                          <td className="py-3 px-2">
                            {product.inStock ? (
                              <span className="text-green-600">In Stock</span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {Orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="capitalize">{order.status}</span>
                        <span className="font-semibold">R{order.total.toFixed(2)}</span>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <h3 className="mb-4">Analytics Dashboard (Drag corners to resize charts)</h3>

              {/* Revenue Chart */}
              <div>
                <h4 className="mb-4">Revenue Trend</h4>
                <ResizableBox
                  defaultWidth="100%"
                  defaultHeight={400}
                  minWidth="100%"
                  minHeight={300}
                  maxHeight={600}
                  enable={{
                    top: false,
                    right: false,
                    bottom: true,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                  }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 h-full">
                      <LineChart data={revenueChartData} />
                    </CardContent>
                  </Card>
                </ResizableBox>
              </div>

              {/* Orders and Category Charts Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Chart */}
                <div>
                  <h4 className="mb-4">Weekly Orders</h4>
                  <ResizableBox
                    defaultWidth="100%"
                    defaultHeight={350}
                    minWidth="100%"
                    minHeight={250}
                    maxHeight={500}
                    enable={{
                      top: false,
                      right: false,
                      bottom: true,
                      left: false,
                      topRight: false,
                      bottomRight: false,
                      bottomLeft: false,
                      topLeft: false,
                    }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6 h-full">
                          <BarChart data={ordersChartData} />
                      </CardContent>
                    </Card>
                  </ResizableBox>
                </div>

                {/* Category Chart */}
                <div>
                  <h4 className="mb-4">Sales by Category</h4>
                  <ResizableBox
                    defaultWidth="100%"
                    defaultHeight={350}
                    minWidth="100%"
                    minHeight={250}
                    maxHeight={500}
                    enable={{
                      top: false,
                      right: false,
                      bottom: true,
                      left: false,
                      topRight: false,
                      bottomRight: false,
                      bottomLeft: false,
                      topLeft: false,
                    }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6 h-full">
                          <DoughnutChart data={categoryChartData} />
                      </CardContent>
                    </Card>
                  </ResizableBox>
                </div>
              </div>

              {/* Info Box */}
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-6">
                  <p className="text-sm">
                    <strong>Note:</strong> These are mock analytics for demonstration. Integrate with [API: GET /admin/analytics] to display real-time data. All charts are resizable - drag the bottom edge to adjust height.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-6">Customer Management</h3>
                <p className="text-muted-foreground">Customer management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-6">Store Settings</h3>
                <div className="space-y-6 max-w-md">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="ModestWear" />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">Contact Email</Label>
                    <Input id="storeEmail" type="email" defaultValue="contact@modestwear.com" />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" defaultValue="ZAR" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}