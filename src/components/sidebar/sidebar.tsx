import { FC } from 'react'
import { redirect } from 'next/navigation'

import {
	getCollaboratingWorkspaces,
	getFolders,
	getPrivateWorkspaces,
	getSharedWorkspaces,
	getUserSubscriptionStatus,
} from '@/lib/supabase/queries'
import { createClient } from '@/utils/supabase/server'

import {
	PlanUsage,
	NativeNavigation,
	WorkspaceDropdown,
	FoldersDropdownList,
} from '@/components/sidebar'
import { twMerge } from 'tailwind-merge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
	params: { workspaceId: string }
	className?: string
}

const Sidebar: FC<SidebarProps> = async ({ params, className }) => {
	const supabase = createClient()
	//user
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return

	//subscription
	const { data: subscriptionData, error: subscriptionError } =
		await getUserSubscriptionStatus(user.id)

	//folders
	const { data: workspaceFolderData, error: foldersError } = await getFolders(
		params.workspaceId
	)

	//error
	if (subscriptionError || foldersError) redirect('/dashboard')

	//get all the different workspaces private collaborating shared
	const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
		await Promise.all([
			getPrivateWorkspaces(user.id),
			getCollaboratingWorkspaces(user.id),
			getSharedWorkspaces(user.id),
		])

	return (
		<aside
			className={twMerge(
				'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
				className
			)}
		>
			<div>
				<WorkspaceDropdown
					privateWorkspaces={privateWorkspaces}
					sharedWorkspaces={sharedWorkspaces}
					collaboratingWorkspaces={collaboratingWorkspaces}
					defaultValue={[
						...privateWorkspaces,
						...collaboratingWorkspaces,
						...sharedWorkspaces,
					].find((workspace) => workspace.id === params.workspaceId)}
				/>
				<PlanUsage
					foldersLength={workspaceFolderData?.length || 0}
					subscription={subscriptionData}
				/>
				<NativeNavigation myWorkspaceId={params.workspaceId} />
				<ScrollArea className="overflow-scroll relative h-[450px]">
					<div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40" />
					<FoldersDropdownList
						workspaceFolders={workspaceFolderData || []}
						workspaceId={params.workspaceId}
					/>
				</ScrollArea>
			</div>
			{/* <UserCard subscription={subscriptionData} /> */}
		</aside>
	)
}

export default Sidebar
