<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductImageService
{
    public function store(UploadedFile $file, string $name): string
    {
        if (! function_exists('imagewebp')) {
            throw ValidationException::withMessages(['image' => ['PHP GD with WebP support is required for product uploads.']]);
        }

        $source = match ($file->getMimeType()) {
            'image/jpeg' => imagecreatefromjpeg($file->getRealPath()),
            'image/png' => imagecreatefrompng($file->getRealPath()),
            'image/webp' => imagecreatefromwebp($file->getRealPath()),
            default => false,
        };
        if (! $source) {
            throw ValidationException::withMessages(['image' => ['The image could not be processed.']]);
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $targetWidth = min(800, $width);
        $targetHeight = max(1, (int) round($height * ($targetWidth / $width)));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagealphablending($target, false);
        imagesavealpha($target, true);
        imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        $directory = public_path('images/menu/admin');
        if (! is_dir($directory)) mkdir($directory, 0755, true);
        $filename = Str::slug($name).'-'.Str::lower(Str::random(8)).'.webp';
        imagewebp($target, $directory.DIRECTORY_SEPARATOR.$filename, 82);
        imagedestroy($source);
        imagedestroy($target);

        return '/images/menu/admin/'.$filename;
    }
}
