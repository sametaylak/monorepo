import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FacebookShare,
  GappedBox,
  IconButton,
  RedditShare,
  styled,
  Toast,
  TwitterShare,
} from "@kampus/ui";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { SerializeFrom } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { canUserEdit } from "~/features/auth/can-user-edit";
import { useUserContext } from "~/features/auth/user-context";
import type { PostWithCommentCount } from "~/models/post.server";
import PostDeleteAlert from "./PostDeleteAlert";

const DotsButton = styled(IconButton, {
  borderRadius: 5,
  height: 25,
  width: 25,
  color: "$gray11",
});

const Item = styled(DropdownMenuItem, {
  minWidth: 0,
  // padding: "$1",
});

interface Props {
  post: SerializeFrom<PostWithCommentCount>;
  shareUrl: string;
}

export const MoreOptionsDropdown: FC<Props> = ({ post, shareUrl }) => {
  const user = useUserContext();
  const [openAlert, setOpenAlert] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpenAlert(true);
  };

  const ownerItems: JSX.Element[] = [];
  if (canUserEdit(user, post)) {
    ownerItems.push(
      <Item onSelect={() => navigate(`/posts/${post.id}/edit`)} key="edit">
        Düzenle
      </Item>
    );
    ownerItems.push(
      <Item onSelect={handleOpen} key="delete">
        Sil
      </Item>
    );
    ownerItems.push(<DropdownMenuSeparator key="separator" />);
  }

  // FIXME: below appears to be redundant, is it?
  const menuItems = [...ownerItems];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <DotsButton color="transparent" aria-label="Daha fazla seçenek">
            <DotsHorizontalIcon />
          </DotsButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {ownerItems}
          <MoreOptionsShareButtons
            postUrl={shareUrl}
            openToast={setOpenToast}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <PostDeleteAlert
        open={openAlert}
        setOpen={setOpenAlert}
        postID={post.id}
      />
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        duration={5000}
        title="Link kopyalandı"
      />
    </>
  );
};

const SocialMediaShareButtons = ({ postUrl }: { postUrl: string }) => {
  return (
    <GappedBox css={{ paddingLeft: 25, paddingTop: 5 }}>
      <FacebookShare size={20} postUrl={postUrl} />
      <TwitterShare size={20} postUrl={postUrl} />
      <RedditShare size={20} postUrl={postUrl} />
    </GappedBox>
  );
};

type MoreOptionsShareButtonsProps = {
  postUrl: string;
  openToast: (value: boolean) => void;
};

const MoreOptionsShareButtons = ({
  postUrl,
  openToast,
}: MoreOptionsShareButtonsProps) => {
  const onCopySelect = () => {
    openToast(true);
  };

  return (
    <>
      <CopyToClipboard text={postUrl}>
        <Item onSelect={onCopySelect}>Adresi kopyala</Item>
      </CopyToClipboard>
      <SocialMediaShareButtons postUrl={postUrl} />
    </>
  );
};
