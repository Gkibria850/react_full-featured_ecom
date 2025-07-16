import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";


import {
  ArrowLeft,
  FileText,
  ImageIcon,
  Save,
  TagIcon,
  Trash2,
  User2Icon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@headlessui/react"; // ✅ Corrected

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Brands", href: route("admin.brands.index") },
  { title: "Create Brand", href: "" },
];

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 0;
}



export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    slug: "",
    description: "",
    status: "0",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    post(route("admin.brands.store"), {
      data: {
        ...data,
      },
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
    <AppLayout breadcrumbs={breadcrumbs} title="Create Brand">
      <Head title="Create Brand" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
        <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Create Brand
            </h2>
            <Link
              href={route("admin.brands.index")}
              className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to List
            </Link>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <User2Icon size={14} className="text-primary dark:text-primary-light" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <FileText size={14} className="text-primary dark:text-primary-light" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light 
                  dark:focus:ring-primary-light/20 min-h-24 w-full rounded-lg border border-gray-200 bg-white/20 p-4 text-base text-gray-900 shadow-sm backdrop-blur-sm 
                  transition-all focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200"
                  placeholder="Enter brand description"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <TagIcon size={14} className="text-primary dark:text-primary-light" />
                  Status
                </Label>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => setData("status", e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="0">Active</option>
                  <option value="1">Deactive</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <ImageIcon size={14} className="text-primary dark:text-primary-light" />
                  Image
                </Label>
                {imagePreview ? (
                  <div className="mb-2 flex items-center space-x-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <Button type="button" variant="destructive" onClick={clearImage}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {errors.image && (
                      <p className="text-sm text-red-500">{errors.image}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-500 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Save Brand
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}