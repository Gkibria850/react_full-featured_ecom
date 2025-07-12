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