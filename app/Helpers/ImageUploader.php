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
