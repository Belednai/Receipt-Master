import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Package,
  DollarSign,
  Tag,
  Hash,
  Box
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Product, 
  saveProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct 
} from "@/lib/product-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProductManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    unitPrice: 0,
    category: "",
    code: "",
    stockLevel: 0
  });

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      unitPrice: 0,
      category: "",
      code: "",
      stockLevel: 0
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.unitPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in product name and set a valid price.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, {
          ...formData,
          isActive: true
        });
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully!",
        });
      } else {
        // Create new product
        await saveProduct({
          ...formData,
          isActive: true,
          createdBy: user?.id || 'admin'
        });
        toast({
          title: "Product Created",
          description: "New product has been added successfully!",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      unitPrice: product.unitPrice,
      category: product.category || "",
      code: product.code || "",
      stockLevel: product.stockLevel || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully!",
      });
      loadProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Items Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage items that cashiers can use for receipts
          </p>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Item" : "Add New Item"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? "Update the item information below."
                    : "Add a new item that cashiers can use when creating receipts."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Soda, Bread, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="e.g., Beverages, Food"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Item Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="e.g., SODA001"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stockLevel">Stock Level</Label>
                  <Input
                    id="stockLevel"
                    type="number"
                    min="0"
                    value={formData.stockLevel}
                    onChange={(e) => setFormData({...formData, stockLevel: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingProduct ? "Update Item" : "Add Item"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <Card className="animate-slide-up">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by adding your first product. Cashiers will be able to use these items when creating receipts.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${product.unitPrice.toFixed(2)}
                        </Badge>
                        {product.category && (
                          <Badge variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {product.code && (
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        <span>Code: {product.code}</span>
                      </div>
                    )}
                    {product.stockLevel !== undefined && (
                      <div className="flex items-center">
                        <Box className="w-4 h-4 mr-2" />
                        <span>Stock: {product.stockLevel} units</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement; 