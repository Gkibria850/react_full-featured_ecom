import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface EditProps {
  admin: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    phone: string;
    address: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Admins", href: route("admin.admins.index") },
  { title: "Edit Admin", href: "" },
];

export default function Edit({ admin }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: admin.name || "",
    username: admin.username || "",
    email: admin.email || "",
    avatar: null as File | null,
    phone: admin.phone || "",
    address: admin.address || "",
    password: "",
    password_confirmation: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    put(route("admin.admins.update", admin.id), {
      data: { ...data },
      preserveScroll: true,
      onProgress: (progress) => {
        if (progress.percentage) setUploadProgress(progress.percentage);
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
      reader.onload = (e) => setImagePreview(e.target?.result as string);
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
    <>
      <Head title="Edit Admin" />
      <AppLayout breadcrumbs={breadcrumbs} title="Edit Admin">
        <div className="from-gray-50 min-h-screen bg-gradient-to-br to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
          <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
            <CardHeader>Edit Admin</CardHeader>
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

                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
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
                  <Input
                    id="address"
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
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {/* Show preview if selected, else show existing avatar */}
                    {(imagePreview || admin.avatar) && (
                     <img
                        src={`/storage/${admin.avatar}`}
                        alt="Avatar Preview"
                        className="h-12 w-12 rounded-full object-cover"
                        />
                    )}

                    {/* Remove Button */}
                    {(imagePreview || admin.avatar) && (
                      <Button type="button" onClick={clearImage}>
                        Remove
                      </Button>
                    )}
                  </div>
                  {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                  />
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
    </>
  );
}
