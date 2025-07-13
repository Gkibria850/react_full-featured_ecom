<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile; 
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;// ❗ Correct class name

class ImageUploader
{
   

public static function uploadImage(UploadedFile $image, string $folder, int $maxWidth = 1200): string
{
    try {
        // Clean and prepare paths
        $folder = trim($folder, '/');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $destinationPath = public_path("uploads/{$folder}");

        // Create destination directory if not exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Initialize Intervention Image manager
        $manager = new ImageManager(new Driver());

        // Make image instance
        $img = $manager->read($image->getRealPath());

        // Resize if wider than maxWidth
        if ($img->width() > $maxWidth) {
            $img->resize($maxWidth, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }

        // Save the image
        $img->save($destinationPath . '/' . $imageName);

        // Return relative path
        return "uploads/{$folder}/{$imageName}";
    } catch (\Exception $e) {
        throw new \RuntimeException('Image upload failed: ' . $e->getMessage());
    }
}
public static function deleteImage(string $path): bool
{
    try {
        $fullPath = public_path($path);

        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    } catch (\Exception $e) {
        // Optionally log the error: logger($e->getMessage());
        return false;
    }
}


}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $this->route('admin')->id,
            'email' => 'nullable|email|max:255|unique:users,email,' . $this->route('admin')->id,
            'avatar' => 'nullable|image|max:2048',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
           
        ];
    }
}
export default function DeleteDialog ({
     isOpen,
     onClose, 
     onConfirm,
     title, 
     message,
     confirmButtonText,
     cancelButtonText}
     : {
        isOpen:boolean;
        onClose:()=>void;
        onConfirm:()=>void;
         title:string;
         message:string;
         confirmButtonText:string; 
         cancelButtonText:string;
        })
{
        return (
            <div className="bg-opacity-50 fixed inset-0 z-50 flect items-center justify-center bg-black" aria-modal="true">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
                    <p className="mb-5 text-sm text-gray-600">{message}</p>
                </div>
                <div className="flex items-center justify-end space-x-3">
                    
                    <button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus-ring-offset-2 focus:outline-none" onClick={onClose}>{cancelButtonText}</button>
                    <button className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus-ring-offset-2 focus:outline-none" onClick={()=>
                        {onConfirm(), onClose();

                        }}>{confirmButtonText}</button>
                </div>
            </div>
        );
}
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

<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile; 
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageUploader
{
    public static function uploadImage(UploadedFile $image, string $folder, int $maxWidth = 1200): string
    {
        try {
            $folder = trim($folder, '/');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path("uploads/{$folder}");

            // Create directory if it doesn't exist
            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Initialize Intervention Image manager
            $manager = new ImageManager(new Driver());

            // Read and optionally resize image
            $img = $manager->read($image->getRealPath());

            if ($img->width() > $maxWidth) {
                $img->resize($maxWidth, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Save image
            $img->save("{$destinationPath}/{$imageName}");

            return "uploads/{$folder}/{$imageName}";
        } catch (\Exception $e) {
            throw new \RuntimeException('Image upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete an uploaded image file.
     *
     * @param string $path
     * @return bool
     */
    public static function deleteImage(string $path): bool
    {
        try {
            $fullPath = public_path($path);

            if (file_exists($fullPath)) {
                return unlink($fullPath);
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }
}


public function edit($id): Response
{
    $admin= User::findOrFail($id);
    $admin->avatar = asset('storage/'.$admin->avatar);
    return Inertia::render('Admin/Admins/Edit', [
        'admin' => $admin,
    ]);
}
public function update(AdminUpdateRequest $request, $id): RedirectResponse
{
   $admin= User::findOrFail($id);
   
   $data= $request->only('name','usermane','email','phone','address');
   if($request->hasFile('avatar')){
    ImageUploader::deleteImage($admin->avatar);
    $data['avatar'] = ImageUploader::uploadImage($request->file('avatar'), 'admins');
   }
   $admin->update($data);
    return redirect()
        ->route('admin.admins.index')
        ->with('success', 'Admin updated successfully.');
}









$admin->avatar = asset('storage/'.$admin->avatar);
public function edit($id): Response
{
    $admin= User::findOrFail($id);
    $admin->avatar = asset('storage/'.$admin->avatar);
    return Inertia::render('Admin/Admins/Edit', [
        'admin' => $admin,
    ]);
}
public function update(AdminUpdateRequest $request, $id): RedirectResponse
{
    $admin = User::findOrFail($id); // ✅ Retrieve the admin by ID

    $data = $request->only(
        'name',
        'username',
        'email',
        'phone',
        'address'
    );

    // Handle avatar upload
    if ($request->hasFile('avatar')) {
        // Delete old avatar if exists
        if ($admin->avatar && file_exists(public_path($admin->avatar))) {
            unlink(public_path($admin->avatar));
        }

        // Upload new image
        $path = ImageUploader::uploadImage($request->file('avatar'), 'avatars');
        $data['avatar'] = $path;
    }

    // Handle password update if provided
    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    }

    // Update admin
    $admin->update($data);

    return redirect()
        ->route('admin.admins.index')
        ->with('success', 'Admin updated successfully.');
}


<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageUploader;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminStoreRequest;
use App\Http\Requests\AdminUpdateRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $admins = User::select('id', 'name', 'username', 'email', 'avatar', 'phone', 'address', 'created_at')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('username', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%')
                      ->orWhere('address', 'like', '%' . $search . '%');
                });
            })
            ->where('role', '=', 'admin')
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

          $admins->getCollection()->transform(function ($admin) {
            $admin->avatar = $admin->avatar ? asset('storage/' . $admin->avatar) : null;
            return $admin;
        });


        return Inertia::render('Admin/Admins/Index', [
            'admins' => $admins,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'perPage' => $perPage,
                'page' => $request->input('page', 1),
            ],
            'can' => [
                'create' => true,
                'edit' => true,
                'delete' => true,
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Admins/Create');
    }

    public function store(AdminStoreRequest $request): RedirectResponse
{
    $data = $request->only(
        'name',
        'username',
        'email',
        'avatar',
        'phone',
        'address',
        'password'
    );

    if ($request->hasFile('avatar')) {
        $path = $request->file('avatar')->store('avatars', 'public');
        $data['avatar'] = $path;
    }

    $data['password'] = Hash::make($request->password);
    $data['role'] = 'admin';
    
    User::create($data);

    return redirect()->route('admin.admins.index')->with('success', 'Admin created successfully.');
}
public function edit($id): Response
{
    $admin= User::findOrFail($id);
    $admin->avatar = asset('storage/'.$admin->avatar);
    return Inertia::render('Admin/Admins/Edit', [
        'admin' => $admin,
    ]);
}
public function update(AdminUpdateRequest $request, User $admin): RedirectResponse
{
    $data = $request->only('name', 'username', 'email', 'phone', 'address');

    if ($request->hasFile('avatar')) {
    ImageUploader::deleteImage($admin->avatar);
    $data['avatar'] = ImageUploader::uploadImage($request->file('avatar'),  'public');
   }

    $admin->update($data);

    return redirect()
        ->route('admin.admins.index')
        ->with('success', 'Admin updated successfully.');
}



public  function destroy($id):RedirectResponse
{
$admin = User::findOrFail($id);
ImageUploader::deleteImage($admin->avatar);
$admin->delete();
 return redirect()->route('admin.admins.index')->with('success', 'Admin deleted successfully.');
}

}
