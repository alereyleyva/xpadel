<?php

namespace App\Entity;

use App\Entity\Enum\PlayerDominantHand;
use App\Entity\Enum\PlayerPosition;
use App\Repository\PlayerProfileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Attribute\Ignore;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: PlayerProfileRepository::class)]
#[ORM\Table(name: 'player_profile', schema: 'xpadel')]
class PlayerProfile
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, options: ['default' => 'gen_random_uuid()'])]
    #[Ignore]
    private Uuid $id;

    #[ORM\Column(nullable: true)]
    private ?float $level = null;

    #[ORM\Column(enumType: PlayerDominantHand::class)]
    private PlayerDominantHand $dominantHand = PlayerDominantHand::UNKNOWN;

    #[ORM\Column(enumType: PlayerPosition::class)]
    private PlayerPosition $position = PlayerPosition::UNKNOWN;

    #[ORM\OneToOne(inversedBy: 'playerProfile', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Ignore]
    private ?User $user = null;

    public function __construct()
    {
        $this->id = Uuid::v4();
    }

    public function getId(): ?string
    {
        return (string)$this->id;
    }

    public function getLevel(): ?float
    {
        return $this->level;
    }

    public function setLevel(float $level): void
    {
        $this->level = $level;
    }

    public function getPosition(): PlayerPosition
    {
        return $this->position;
    }

    public function setPosition(PlayerPosition $position): void
    {
        $this->position = $position;
    }

    public function getDominantHand(): PlayerDominantHand
    {
        return $this->dominantHand;
    }

    public function setDominantHand(PlayerDominantHand $dominantHand): void
    {
        $this->dominantHand = $dominantHand;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }
}
