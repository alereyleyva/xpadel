<?php declare(strict_types=1);

namespace App\Controller\User;

use App\Entity\User;
use App\Entity\UserProfile;
use League\Flysystem\Filesystem;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetUserController extends AbstractController
{
    public function __construct(private readonly Filesystem $filesystem) {}

    #[Route('/api/me', name: 'app_get_current_user', methods: 'GET')]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $userProfile = $user->getUserProfile();

        $processedAvatar = $this->generateTemporaryAvatar($userProfile);
        $user->getUserProfile()->setAvatar($processedAvatar);

        return $this->json($user);
    }

    private function generateTemporaryAvatar(UserProfile $userProfile): ?string
    {
        $userAvatar = $userProfile->getAvatar();

        if (null === $userAvatar) {
            return null;
        }

        $date = new \DateTime();
        $date->add(new \DateInterval('PT1H'));

        return $this->filesystem->temporaryUrl($userAvatar, $date);
    }
}
