<?php declare(strict_types=1);

namespace App\Controller\Authentication;

final readonly class AuthenticationResult
{
    public function __construct(public string $accessToken) {}
}
