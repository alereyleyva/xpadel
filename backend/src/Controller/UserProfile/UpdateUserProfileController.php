<?php declare(strict_types=1);

namespace App\Controller\UserProfile;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UpdateUserProfileController extends AbstractController
{
    public function __construct(private readonly UserRepository $userRepository) {}

    #[Route('/api/me', name: 'app_update_current_user', methods: 'POST')]
    public function index(
        Request $request,
        #[CurrentUser] ?User $user,
    ): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $payload = $request->getPayload()->all();

        $userProfile = $user->getUserProfile();

        $updatedFirstValue = $this->processFieldUpdateValueFromPayload($payload, 'firstName', $userProfile->getFirstName());
        $userProfile->setFirstName($updatedFirstValue);

        $updatedLastName = $this->processFieldUpdateValueFromPayload($payload, 'lastName', $userProfile->getLastName());
        $userProfile->setLastName($updatedLastName);

        $updatedPhoneNumber = $this->processFieldUpdateValueFromPayload($payload, 'phoneNumber', $userProfile->getPhoneNumber());
        $userProfile->setPhoneNumber($updatedPhoneNumber);

        $updatedInstagramAccount = $this->processFieldUpdateValueFromPayload($payload, 'instagramAccount', $userProfile->getInstagramAccount());
        $userProfile->setInstagramAccount($updatedInstagramAccount);

        $user->setUserProfile($userProfile);

        $this->userRepository->save($user);

        return $this->json($user);
    }

    private function processFieldUpdateValueFromPayload(array $payload, string $field, mixed $fallback): mixed
    {
        if (array_key_exists($field, $payload)) {
            return $payload[$field];
        }

        return $fallback;
    }
}
