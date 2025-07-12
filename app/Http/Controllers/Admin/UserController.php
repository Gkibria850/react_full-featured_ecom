<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia; // ✅ Add this
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $users = User::select('id', 'name', 'username', 'email', 'phone', 'address', 'created_at')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('username', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%')
                      ->orWhere('address', 'like', '%' . $search . '%');
                });
            })
            ->where('role', '!=', 'admin')
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString(); // preserves query params

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' =>[
                'search'=>$search,
                'sort'=> $sort,
                'direction' => $direction,
                'perPage'=>$perPage,
                'page' =>$request->input('page',1)
            ],
            'can' =>[
                'create' => true,
                'edit' =>true,
                'delete'=> true
            ],
        ]);
    }
}
