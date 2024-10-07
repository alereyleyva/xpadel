<?php declare(strict_types=1);

namespace App\Controller\UserProfile;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UpdateUserProfileController extends AbstractController
{
    public function  __construct(private readonly UserRepository $userRepository) {}

    #[Route('/api/me', name: 'app_update_current_user', methods: 'PATCH')]
    public function index(
        #[CurrentUser] ?User $user,
        #[MapRequestPayload] UpdateUserProfilePayload $requestPayload,
    ): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $userProfile = $user->getProfile();

        $userProfile->setFirstName($requestPayload->firstName);
        $userProfile->setLastName($requestPayload->lastName);
        $userProfile->setPhoneNumber($requestPayload->phoneNumber);
        $userProfile->setInstagramAccount($requestPayload->instagramAccount);

        $user->setProfile($userProfile);

        $this->userRepository->save($user);

        return $this->json($user);
    }
}
