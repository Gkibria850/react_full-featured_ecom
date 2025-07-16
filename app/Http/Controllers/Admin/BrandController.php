<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageUploader;
use App\Http\Controllers\Controller;
use App\Http\Requests\BrandStoreUpdateRequest;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Monolog\Level;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $brands = Brand::query()
            //->with('parent')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $brands->getCollection()->transform(function ($brand) {
            $brand->image = $brand->image ? asset('storage/' . $brand->image) : null;
            return $brand;
        });

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
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
        return Inertia::render('Admin/Brands/Create');
    }

    public function store(BrandStoreUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('brands', 'public');
        }

        $data['created_by_id'] = auth()->id();
        $data['edited_by_id'] = auth()->id();
        Brand::create($data);

        // ✅ corrected route name here
        return redirect()->route('admin.brands.index')->with('success', 'Brand created successfully.');
    }

    public function edit($id): Response
    {
        $brand = Brand::findOrFail($id);
        $brand->image = $brand->image ? asset('storage/' . $brand->image) : null;

        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
           
        ]);
    }

    public function update(BrandStoreUpdateRequest $request, Brand $brand): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($brand->image) {
                ImageUploader::deleteImage('storage/' . $brand->image);
            }
            $data['image'] = $request->file('image')->store('brands', 'public');
        }

        $data['edited_by_id'] = auth()->id();

        $brand->update($data);

        return redirect()->route('admin.brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->image) {
            ImageUploader::deleteImage('storage/' . $brand->image);
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')->with('success', 'Brand deleted successfully.');
    }
}




