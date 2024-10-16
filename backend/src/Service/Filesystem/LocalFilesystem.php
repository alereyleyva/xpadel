<?php declare(strict_types=1);

namespace App\Service\Filesystem;

use League\Flysystem\Filesystem;

class LocalFilesystem extends Filesystem {
    public function temporaryUrl(string $path, \DateTimeInterface $expiresAt, array $config = []): string
    {
        $timestamp = $expiresAt->getTimestamp();

        return sprintf('http://localhost/avatars/%s?date=%s', $path, $timestamp);
    }
}
