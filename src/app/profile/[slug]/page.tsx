'use client';
import UserProfileContainer from '@/components/profile/UserProfileContainer';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();

  console.log('🌐 [ProfilePage] Raw params object:', params);
  console.log('📖 [ProfilePage] Params keys:', Object.keys(params));

  // Test different parameter extraction methods
  const userIdFromUserId = params?.userId
    ? Array.isArray(params.userId)
      ? params.userId[0]
      : params.userId
    : undefined;
  const userIdFromSlug = params?.slug
    ? Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug
    : undefined;
  const userIdFromId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  console.log('🎯 [ProfilePage] Parameter extraction results:', {
    userIdFromUserId,
    userIdFromSlug,
    userIdFromId,
  });

  // Try different parameter names - use the one that works
  const userId = userIdFromUserId || userIdFromSlug || userIdFromId;

  console.log('✅ [ProfilePage] Final userId:', userId);

  return <UserProfileContainer userId={userId} />;
}
