import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, FileText, ImageIcon, Save, TagIcon, Trash2, User2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@headlessui/react";
import { SelectItem } from "@radix-ui/react-select";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Categories", href: route("admin.categories.index") },
  { title: "Create Category", href: "" },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  descriptione: string;
  des_shor: string;
  parent_id: number | null;
  image: string;
  status: 0;
}

interface CategoryWithPath extends Category {
  path: string;
  level: number;
}

export default function Create({ categories }: { categories: CategoryWithPath[] }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
    description: '',
    des_short: '',
    parent_id: '',
    status: '0',
    image: null as file | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    post(route("admin.categories.store"), {
      data,
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
    <AppLayout breadcrumbs={breadcrumbs} title="Create Category">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
                 <div className="space-y-2">
                <Label htmlFor="name" className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <User2Icon 
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Slug */}
              {/* <div className="space-y-2">
                <Label htmlFor="slug" className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <FileText  
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />
                  Slug</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData("slug", e.target.value)}
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
              </div> */}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <FileText  
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />
                  Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  className='focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light 
                  dark:focus:ring-primary-light/20 min-h-24 w-full rounded-lg border border-gray-200 bg-white/20 p-4 text-base text-gray-900 shadow-sm backdrop-blur-sm 
                  transition-all focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200'
                  placeholder="Enter category description"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Short Description */}
               <div className="space-y-2">
                <Label htmlFor="des_short" className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <FileText  
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />
                  Short Description</Label>
                <Input
                  id="des_short"
                  value={data.des_short}
                  onChange={(e) => setData("des_short", e.target.value)}
                />
                {errors.des_short && <p className="text-sm text-red-500">{errors.des_short}</p>}
              </div>

            {/* Status */}
                   <div className="space-y-2">
                <Label htmlFor="status" className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <TagIcon  
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />Status</Label>
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
                <Label  className=" flex items-center gap-2 text-sm font-medium text-gray-700 dark::text-gray-200">
                  <ImageIcon  
                  size={14}
                  className="text-primary dark:text-primary-light"
                  />Image</Label>
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


              <div className="space-y-2">
                <Label
                  htmlFor="parent_id"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <TagIcon
                    size={14}
                    className="text-primary dark:text-primary-light"
                  />
                  Parent Category
                </Label>

                <select
                  id="parent_id"
                  value={data.parent_id ?? ''}
                  onChange={(e) => setData("parent_id", e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- No Parent --</option>
                  {categories && categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {" ".repeat(category.level * 2)}{category.level > 0 && "↳ "}{category.name}
                    </option>
                  ))}
                </select>

                {errors.parent_id && (
                  <p className="text-sm text-red-500">{errors.parent_id}</p>
                )}
              </div>


              {/* Submit */}
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Save Category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
import { usePage, router } from "@inertiajs/react";
import DataTable from "@/components/DataTables/DataTables";
import AppLayout from "@/layouts/app-layout";
import { FolderKanban } from "lucide-react"; // Icon for categories

export default function CategoriesIndex() {
  const { categories, filters, can } = usePage().props;

  const columns = [
    {
      key: 'index',
      label: '#',
      sortable: false,
      type: 'IndexColum',
      width: '50px',
      render: (_item: any, index: number) => {
        return (filters.page - 1) * filters.perPage + (index + 1);
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'parent_id',
      label: 'Parent Id',
      sortable: true,
      type: 'text',
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      type: 'text',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      type: 'text',
    },
    {
      key: 'des_short',
      label: 'Short Description',
      sortable: true,
      type: 'text',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'text',
      render: (item: any) => (
        <span className={item.status === '0' ? 'text-green-600' : 'text-red-500'}>
          {item.status === '0' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      width: '50px',
      render: (item: any) => {
        return item.image ? (
          <img
            src={item.image}
            alt={`${item.name} image`}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      type: 'date2',
    },
  ];

  const handleDelete = (id: string) => {
    router.delete(route('admin.categories.destroy', id), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout title="Categories">
      <div className="py-6">
        <div className="mx-auto">
          <DataTable
            data={categories}
            columns={columns}
            resourceName="Categories"
            singularName="Category"
            routeName="admin.categories.index"
            filters={filters}
            canViewResource={false}
            canCreateResource={can.create}
            canEditResource={can.edit}
            canDeleteResource={can.delete}
            viewRoute="admin.categories.show"
            createRoute="admin.categories.create"
            editRoute="admin.categories.edit"
            onDelete={handleDelete}
            icon={FolderKanban}
          />
        </div>
      </div>
    </AppLayout>
  );
}
<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageUploader;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreUpdateRequest;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Monolog\Level;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $categories = Category::query()
            ->with('parent')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('des_short', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $categories->getCollection()->transform(function ($category) {
            $category->image = $category->image ? asset('storage/' . $category->image) : null;
            if($category->parent_id){
             //$category->parent_name = $category->parent->name;

                $parent = Category::find($category->parent_id);
                $category->parent_name = $parent ? $parent->name :"N/A";
            } else {
                $category->parent_name ="N/A";
            }
            return $category;
        });

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
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

   public function create(): Response
    {
        $categories = Category::isParent()->with('descendants')->get();
        $flattenCategories = $this->flattenCategories($categories);

        return Inertia::render('Admin/Categories/Create', [
            'categories' => $flattenCategories,
        ]);
    }


    public function store(CategoryStoreUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }
            $data['created_by_id'] = auth()->id();
            $data['edited_by_id'] = auth()->id();
            Category::create($data);


    

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }
        public function edit(int $id): Response
        {
            $category = Category::findOrFail($id);
            $category->image = $category->image ? asset('storage/' . $category->image) : null;

            return Inertia::render('Admin/Categories/Edit', [
                'category' => $category,
                'parents' => Category::where('id', '!=', $category->id)->select('id', 'name')->get(),
            ]);
        }



    public function update(CategoryStoreUpdateRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($category->image) {
                ImageUploader::deleteImage('storage/' . $category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $data['edited_by_id'] = auth()->id();

        $category->update($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->image) {
            ImageUploader::deleteImage('storage/' . $category->image);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }

    public function flattenCategories($categories, $prefix = '', $result = [])
{
    foreach ($categories as $category) {
        $path = $prefix ? "$prefix > $category->name" : $category->name;

        $result[] = [
            'id' => $category->id,
            'name' => $category->name,
            'path' => $path,
            'level' => substr_count($path, '>'),
        ];

        if ($category->descendants && $category->descendants->count() > 0) {
            $result = $this->flattenCategories($category->descendants, $path, $result);
        }
    }

    return $result;
}

}