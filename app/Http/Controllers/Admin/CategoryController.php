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

