import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Categories", href: route("admin.categories.index") },
  { title: "Edit Category", href: "" },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  des_short: string;
  parent_id: number | null;
  image: string | null;
  status: string;
}

interface CategoryWithPath {
  id: number;
  name: string;
  path: string;
  level: number;
}

export default function Edit({ category, parents }: { category: Category; parents: CategoryWithPath[] }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    des_short: category.des_short || '',
    parent_id: category.parent_id ?? '',
    status: category.status.toString(),
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(category.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    post(route("admin.categories.update", category.id), {
      forceFormData: true,
      preserveScroll: true,
      onProgress: (progress) => {
        if (progress.percentage) {
          setUploadProgress(progress.percentage);
        }
      },
      onSuccess: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
      onError: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setData("image", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs} title="Edit Category">
       <Head title="Create Category" />
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
         <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
           <CardHeader className="flex flex-row items-center justify-between">
             <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
               Create Category
             </h2>
             <Link
               href={route("admin.categories.index")}
               className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
             >
               <ArrowLeft className="mr-1 h-4 w-4" />
               Back to List
             </Link>
           </CardHeader>
           <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

             

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <input id="description" value={data.description} onChange={(e) => setData("description", e.target.value)} />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="des_short">Short Description</Label>
                <Input id="des_short" value={data.des_short} onChange={(e) => setData("des_short", e.target.value)} />
                {errors.des_short && <p className="text-sm text-red-500">{errors.des_short}</p>}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => setData("status", e.target.value)}
                  className="w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="0">Active</option>
                  <option value="1">Deactive</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
              </div>

              {/* Parent Category */}
              <div>
                <Label htmlFor="parent_id">Parent Category</Label>
                <select
                  id="parent_id"
                  value={data.parent_id ?? ''}
                  onChange={(e) => setData("parent_id", e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- No Parent --</option>
                  {parents.map((category) => (
                    <option key={category.id} value={category.id}>
                      {" ".repeat(category.level * 2)}{category.level > 0 && "↳ "}{category.name}
                    </option>
                  ))}
                </select>
                {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
              </div>

              {/* Image */}
              <div>
                <Label>Image</Label>
                {imagePreview ? (
                  <div className="flex items-center space-x-4">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
                    <Button type="button" variant="destructive" onClick={clearImage}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                )}
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              </div>

              {isUploading && (
                <div>
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Update Category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
