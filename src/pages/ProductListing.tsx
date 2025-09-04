// src/pages/ProductListing.jsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const ProductListing = () => {
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<string | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">List Your Product</h1>
          <p className="text-muted-foreground">
            Upload details to list your product on AuthX Marketplace
          </p>
        </div>

        <Card className="glass-panel p-8 space-y-6">
          {/* Upload Image */}
          <div>
            <Label className="mb-2 block">Product Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <div className="mt-4">
                <img
                  src={image}
                  alt="Product preview"
                  className="rounded-lg w-48 h-48 object-cover shadow-md border border-border"
                />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <Label className="mb-2 block">Product Name</Label>
            <Input placeholder="Enter product name" />
          </div>

          <div>
            <Label className="mb-2 block">Description</Label>
            <Textarea placeholder="Enter product description..." rows={4} />
          </div>

          <div>
            <Label className="mb-2 block">Category</Label>
            <Input placeholder="e.g. Collectible, Artifact, NFT..." />
          </div>

          {/* Price */}
          <div>
            <Label className="mb-2 block">Price (in ₹)</Label>
            <Input
              type="number"
              placeholder="Enter price"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          {/* Physical Inspection if price > 1000 */}
          {price > 1000 && (
            <Card className="glass-card p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Physical Inspection Required
              </h2>

              <div>
                <Label className="mb-2 block">Inspection Date</Label>
                <Input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Inspection Location</Label>
                <Input placeholder="Enter location for inspection" />
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
            List Product
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProductListing;
