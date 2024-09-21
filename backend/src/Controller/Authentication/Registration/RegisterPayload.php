<?php declare(strict_types=1);

namespace App\Controller\Authentication\Registration;

readonly final class RegisterPayload
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}
}
