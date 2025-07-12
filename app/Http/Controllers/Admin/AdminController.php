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
    return Inertia::render('Admin/Admins/Edit', [
        'admin' => $admin,
    ]);
}
public function update(AdminUpdateRequest $request, User $admin): RedirectResponse
{
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

public  function destroy($id):RedirectResponse
{
$admin = User::findOrFail($id);
ImageUploader::deleteImage($admin->avatar);
$admin->delete();
 return redirect()->route('admin.admins.index')->with('success', 'Admin deleted successfully.');
}

}
