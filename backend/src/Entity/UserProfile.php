<?php

namespace App\Entity;

use App\Repository\UserProfileRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Attribute\Ignore;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserProfileRepository::class)]
#[ORM\Table(name: 'user_profile', schema: 'xpadel')]
class UserProfile
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, options: ["default" => "gen_random_uuid()"])]
    #[Ignore]
    private Uuid $id;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $lastName = null;

    #[ORM\Column(type: Types::TEXT, unique: true, nullable: true)]
    private ?string $phoneNumber = null;

    #[ORM\OneToOne(inversedBy: 'profile', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Ignore]
    private ?User $user = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $instagramAccount = null;

    public function __construct()
    {
        $this->id = Uuid::v4();
    }

    public function getId(): string
    {
        return (string) $this->id;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): void
    {
        $this->avatar = $avatar;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): void
    {
        $this->firstName = $firstName;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): void
    {
        $this->lastName = $lastName;
    }

    public function getFullName(): ?string
    {
        if (null === $this->firstName && null === $this->lastName) {
            return null;
        }

        $fullName = sprintf('%s %s', $this->firstName, $this->lastName);

        return trim($fullName);
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): void
    {
        $this->phoneNumber = $phoneNumber;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getInstagramAccount(): ?string
    {
        return $this->instagramAccount;
    }

    public function setInstagramAccount(?string $instagramAccount): void
    {
        $this->instagramAccount = $instagramAccount;
    }
}
