import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  AlertCircle,
  ArrowLeft,
  ImageIcon,
  Save,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Admins", href: route("admin.admins.index") },
  { title: "Edit Admin", href: "" },
];
interface Admin{
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  address: string;
  avatar: string;
}
export default function Edit({admin} :{admin: Admin}) {
 const { data, setData, post, processing, errors } = useForm({
 _method: 'put',
  name: admin.name || "",
    email: admin.email || "",
    avatar: null as File | null,
    phone: admin.phone || "",
    address: admin.address || "",
    
});

  const [imagePreview, setImagePreview] = useState<string | null>(admin.avatar ||null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

   post(route("admin.admins.update", admin.id), {
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
      setData("avatar", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setData("avatar", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
  <AppLayout breadcrumbs={breadcrumbs} title="Edit Admin">
  <div className="from-gray-50 min-h-screen bg-gradient-to-br to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
    <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
     
      <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Edit Admin
            </h2>
            <Link
              href={route("admin.admins.index")}
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
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

         

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

         {/* Avatar Upload */}
          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="avatar"
                name="avatar" // ✅ important for file submission
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* Show image preview (new or existing) */}
              {(imagePreview || admin.avatar) && (
                <img
                  src={imagePreview ?? `/${admin.avatar}`}
                  alt="Avatar Preview"
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}

              {/* Remove button if preview or existing avatar */}
              {(imagePreview || admin.avatar) && (
                <Button type="button" onClick={clearImage}>
                  Remove
                </Button>
              )}
            </div>
            {errors.avatar && (
              <p className="text-sm text-red-500">{errors.avatar}</p>
            )}
          </div>


        

          {/* Submit */}
          <Button type="submit" disabled={processing || isUploading}>
            <Save className="mr-2 h-4 w-4" />
            Update Admin
          </Button>
          {isUploading && <Progress value={uploadProgress} />}
        </form>
      </CardContent>
    </Card>
  </div>
</AppLayout>

  );
}
