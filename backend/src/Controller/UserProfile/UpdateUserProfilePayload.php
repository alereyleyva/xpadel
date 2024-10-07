<?php declare(strict_types=1);

namespace App\Controller\UserProfile;

readonly final class UpdateUserProfilePayload
{
    public function __construct(
        public ?string $firstName = null,
        public ?string $lastName = null,
        public ?string $phoneNumber = null,
        public ?string $instagramAccount = null
    ) {}
}
