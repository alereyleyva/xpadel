<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Ignore;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`', schema: 'xpadel')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, options: ['default' => 'gen_random_uuid()'])]
    private Uuid $id;

    #[ORM\Column(type: Types::TEXT, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    #[Ignore]
    private ?string $password = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    public \DateTimeImmutable $createdAt;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private UserProfile $userProfile;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private PlayerProfile $playerProfile;

    public function __construct()
    {
        $this->id = Uuid::v4();
        $this->createdAt = new \DateTimeImmutable();

        $userProfile = new UserProfile();
        $this->setUserProfile($userProfile);

        $playerProfile = new PlayerProfile();
        $this->setPlayerProfile($playerProfile);
    }

    public function getId(): string
    {
        return (string) $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    #[Ignore]
    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;

        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getUserProfile(): UserProfile
    {
        return $this->userProfile;
    }

    public function setUserProfile(UserProfile $userProfile): void
    {
        if ($userProfile->getUser() !== $this) {
            $userProfile->setUser($this);
        }

        $this->userProfile = $userProfile;
    }

    public function getPlayerProfile(): PlayerProfile
    {
        return $this->playerProfile;
    }

    public function setPlayerProfile(PlayerProfile $playerProfile): void
    {
        if ($playerProfile->getUser() !== $this) {
            $playerProfile->setUser($this);
        }

        $this->playerProfile = $playerProfile;
    }

    #[Ignore]
    public function getFullName(): ?string
    {
        return $this->userProfile->getFullName();
    }

    #[Ignore]
    public function getPhoneNumber(): ?string
    {
        return $this->userProfile->getPhoneNumber();
    }

    #[Ignore]
    public function getInstagramAccount(): ?string
    {
        $instagramAccount = $this->userProfile->getInstagramAccount();

        if (null === $instagramAccount) {
            return null;
        }

        return sprintf('@%s', $instagramAccount);
    }

    #[Ignore]
    public function getPosition(): string
    {
        return $this->playerProfile->getPosition()->value;
    }

    #[Ignore]
    public function getDominantHand(): string
    {
        return $this->playerProfile->getDominantHand()->value;
    }

    #[Ignore]
    public function getLevel(): ?float
    {
        return $this->playerProfile->getLevel();
    }
}
