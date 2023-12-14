"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { updateBasicInfoValidation, updatePasswordValidation } from "~/lib/hooks/useValidation";

export default function SettingsForm() {
  const router = useRouter();

  const [isPendingBasicInfo, setIsPendingBasicInfo] = useState<boolean>(false);
  const [isPendingSocialLinks, setIsPendingSocialLinks] = useState<boolean>(false);
  const [isPendingPassword, setIsPendingPassword] = useState<boolean>(false);

  const [basicInfoFormErrors, setBasicInfoFormErrors] = useState<any>(null);
  const [changePasswordFormErrors, setChangePasswordFormErrors] = useState<any>(null);

  // privacy options states...
  const [displayName, setDisplayName] = useState<boolean>(false);
  const [receiveFilesAnonymous, setReceiveFilesAnonymous] = useState<boolean>(false);
  const [receiveImagesAnonymous, setReceiveImagesAnonymous] = useState<boolean>(false);

  // basic info states...
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [shortBio, setShortBio] = useState<string>("");
  const [favoriteQuote, setFavoriteQuote] = useState<string>("");

  // social links states...
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [instagramLink, setInstagramLink] = useState<string>("");
  const [twitterxLink, setTwitterxLink] = useState<string>("");
  const [tiktokLink, setTiktokLink] = useState<string>("");
  const [linkedinLink, setLinkedinLink] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [spotifyLink, setSpotifyLink] = useState<string>("");
  const [websiteLink, setWebsiteLink] = useState<string>("");

  // change password states...
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  // TRPCs...
  const utils = trpc.useContext();
  const updatePrivacyMutation = trpc.updatePrivacy.useMutation();
  const updateBasicInfoMutation = trpc.updateBasicInfo.useMutation();
  const updateSocialMutation = trpc.updateSocial.useMutation();
  const updatePasswordMutation = trpc.updatePassword.useMutation();

  const { data: user, isLoading: isLoadingUser } = trpc.user.useQuery();

  useEffect(() => {
    if (user) {
      setDisplayName(user?.is_display_name);
      setReceiveFilesAnonymous(user?.is_receive_files_anonymous);
      setReceiveImagesAnonymous(user?.is_receive_images_anonymous);

      setName(user?.name ?? "");
      setUsername(user?.username ?? "");
      setEmail(user?.email ?? "");
      setShortBio(user?.short_bio ?? "");
      setFavoriteQuote(user?.favorite_quote ?? "");

      setFacebookLink(user?.facebook_link ?? "");
      setInstagramLink(user?.instagram_link ?? "");
      setTwitterxLink(user?.twitterx_link ?? "");
      setTiktokLink(user?.tiktok_link ?? "");
      setLinkedinLink(user?.linkedin_link ?? "");
      setGithubLink(user?.github_link ?? "");
      setYoutubeLink(user?.youtube_link ?? "");
      setSpotifyLink(user?.spotify_link ?? "");
      setWebsiteLink(user?.website_link ?? "");
    }
  }, [user]);

  const handleUpdatePrivacy = async ({
    isDisplayName,
    isReceiveFilesAnonymous,
    isReceiveImagesAnonymous,
  }: {
    isDisplayName: boolean;
    isReceiveFilesAnonymous: boolean;
    isReceiveImagesAnonymous: boolean;
  }) => {
    await updatePrivacyMutation.mutateAsync(
      {
        is_display_name: isDisplayName,
        is_receive_files_anonymous: isReceiveFilesAnonymous,
        is_receive_images_anonymous: isReceiveImagesAnonymous,
      },
      {
        onSuccess: () => {
          utils.profile.invalidate();
          utils.user.invalidate();
          utils.users.invalidate();
          router.refresh();
          setIsPendingBasicInfo(false);
          myToast({
            type: "success",
            message: "Updated successfully.",
          });
        },
        onError: () => {
          myToast({
            type: "error",
            message: "Error updating privacy option, try again.",
          });
        },
      },
    );
  };

  const handleUpdateBasicInfo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateBasicInfoValidation.validate({ name, username, email }, { abortEarly: false });

      setIsPendingBasicInfo(true);

      await updateBasicInfoMutation.mutateAsync(
        {
          name,
          email,
          username,
          short_bio: shortBio,
          favorite_quote: favoriteQuote,
        },
        {
          onSuccess: () => {
            utils.profile.invalidate();
            utils.user.invalidate();
            utils.users.invalidate();
            router.refresh();
            setIsPendingBasicInfo(false);
            myToast({
              type: "success",
              message: "Updated successfully.",
            });
          },
          onError: (error) => {
            setIsPendingBasicInfo(false);
            if (error.message === "email")
              return myToast({
                type: "error",
                message: "Email is not available.",
              });
            if (error.message === "username")
              return myToast({
                type: "error",
                message: "Username is not available.",
              });
          },
        },
      );
    } catch (error: any) {
      if (error?.inner) {
        const errors: any = {};
        error.inner.forEach((e: any) => {
          errors[e.path] = e.message;
        });
        setBasicInfoFormErrors(errors);
      }
    }
  };

  const handleUpdateSocialLinks = async (e: FormEvent) => {
    e.preventDefault();

    setIsPendingSocialLinks(true);

    await updateSocialMutation.mutateAsync(
      {
        facebook: facebookLink,
        instagram: instagramLink,
        twitterx: twitterxLink,
        tiktok: tiktokLink,
        linkedin: linkedinLink,
        github: githubLink,
        youtube: youtubeLink,
        spotify: spotifyLink,
        website: websiteLink,
      },
      {
        onSuccess: () => {
          utils.profile.invalidate();
          utils.user.invalidate();
          utils.users.invalidate();
          router.refresh();
          setIsPendingSocialLinks(false);
          myToast({
            type: "success",
            message: "Updated successfully.",
          });
        },
        onError: () => {
          setIsPendingSocialLinks(false);
          myToast({
            type: "error",
            message: "Error updating social media links, try again.",
          });
        },
      },
    );
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updatePasswordValidation.validate(
        { oldpassword: oldPassword, newpassword: newPassword, repassword },
        { abortEarly: false },
      );

      setIsPendingPassword(true);

      await updatePasswordMutation.mutateAsync(
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          onSuccess: () => {
            utils.profile.invalidate();
            utils.user.invalidate();
            utils.users.invalidate();
            router.refresh();
            setIsPendingPassword(false);
            setOldPassword("");
            setNewPassword("");
            setRepassword("");
            myToast({
              type: "success",
              message: "You password is updated.",
            });
          },
          onError: (error) => {
            setIsPendingPassword(false);
            myToast({
              type: "error",
              message: error.message,
            });
          },
        },
      );
    } catch (error: any) {
      if (error?.inner) {
        const errors: any = {};
        error.inner.forEach((e: any) => {
          errors[e.path] = e.message;
        });
        setChangePasswordFormErrors(errors);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto py-5 md:py-0">
      <div className="flex h-full w-full max-w-2xl flex-col items-center gap-y-10 rounded-xl">
        <div className="flex w-full flex-row items-start justify-between bg-white dark:bg-default-black">
          <div className="flex w-full flex-row items-center justify-center">
            <h1 className="ml-3 text-center text-xl font-bold">Settings</h1>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-5 px-3 pb-3">
          {/* PRIVACY OPTIONS */}
          <div className="flex w-full flex-col gap-y-3">
            <div className="mb-3 flex w-full flex-row items-center justify-start">
              <h2 className="font-bold">Privacy Options</h2>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-x-1">
              <p className="text-sm">Display your name in your profile</p>
              <Switch
                disabled={isLoadingUser}
                checked={displayName}
                onChange={() => {
                  setDisplayName(!displayName);
                  handleUpdatePrivacy({
                    isDisplayName: !displayName,
                    isReceiveFilesAnonymous: receiveFilesAnonymous,
                    isReceiveImagesAnonymous: receiveImagesAnonymous,
                  });
                }}
                className={clsx(
                  displayName ? "bg-green-500" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 items-center rounded-full",
                )}
              >
                <span
                  className={clsx(
                    displayName
                      ? "translate-x-6 bg-white dark:bg-default-black"
                      : "translate-x-1 bg-green-500",
                    "inline-block h-4 w-4 transform rounded-full transition",
                  )}
                />
              </Switch>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-x-1">
              <p className="text-sm">Receive files from anyone</p>
              <Switch
                disabled={isLoadingUser}
                checked={receiveFilesAnonymous}
                onChange={() => {
                  setReceiveFilesAnonymous(!receiveFilesAnonymous);
                  handleUpdatePrivacy({
                    isDisplayName: displayName,
                    isReceiveFilesAnonymous: !receiveFilesAnonymous,
                    isReceiveImagesAnonymous: receiveImagesAnonymous,
                  });
                }}
                className={clsx(
                  receiveFilesAnonymous ? "bg-green-500" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 items-center rounded-full",
                )}
              >
                <span
                  className={clsx(
                    receiveFilesAnonymous
                      ? "translate-x-6 bg-white dark:bg-default-black"
                      : "translate-x-1 bg-green-500",
                    "inline-block h-4 w-4 transform rounded-full transition",
                  )}
                />
              </Switch>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-x-1">
              <p className="text-sm">Receive images from anyone</p>
              <Switch
                disabled={isLoadingUser}
                checked={receiveImagesAnonymous}
                onChange={() => {
                  setReceiveImagesAnonymous(!receiveImagesAnonymous);
                  handleUpdatePrivacy({
                    isDisplayName: displayName,
                    isReceiveFilesAnonymous: receiveFilesAnonymous,
                    isReceiveImagesAnonymous: !receiveImagesAnonymous,
                  });
                }}
                className={clsx(
                  receiveImagesAnonymous ? "bg-green-500" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 items-center rounded-full",
                )}
              >
                <span
                  className={clsx(
                    receiveImagesAnonymous
                      ? "translate-x-6 bg-white dark:bg-default-black"
                      : "translate-x-1 bg-green-500",
                    "inline-block h-4 w-4 transform rounded-full transition",
                  )}
                />
              </Switch>
            </div>
          </div>
          {/* BASIC INFORMATION */}
          <form
            onSubmit={handleUpdateBasicInfo}
            className="flex w-full flex-col items-start gap-y-3"
          >
            <div className="mb-3 flex w-full flex-row items-center justify-start">
              <h2 className="font-bold">Basic Information</h2>
            </div>
            <div className="flex w-full flex-col items-center gap-x-0 gap-y-3 md:flex-row md:items-start md:gap-x-3 md:gap-y-0">
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="name" className="ml-2 text-sm">
                  Name
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    const capitalizedValue = value
                      .split(" ")
                      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
                      .join(" ");
                    setBasicInfoFormErrors(null);
                    setName(capitalizedValue);
                  }}
                />
                {basicInfoFormErrors && basicInfoFormErrors.name && (
                  <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                    {basicInfoFormErrors.name}
                  </span>
                )}
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="username" className="ml-2 text-sm">
                  Username
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    const formatterUser = e.currentTarget.value.replace(/ /g, "").toLowerCase();
                    setBasicInfoFormErrors(null);
                    setUsername(formatterUser);
                  }}
                />
                {basicInfoFormErrors && basicInfoFormErrors.username && (
                  <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                    {basicInfoFormErrors.username}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-1">
              <label htmlFor="shortbio" className="ml-2 text-sm">
                Short bio
              </label>
              <textarea
                disabled={isLoadingUser}
                className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input resize-none")}
                autoComplete="off"
                rows={5}
                cols={40}
                spellCheck={false}
                id="shortbio"
                value={shortBio}
                onChange={(e) => setShortBio(e.currentTarget.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-y-1">
              <label htmlFor="favoritequote" className="ml-2 text-sm">
                Favorite quote
              </label>
              <textarea
                disabled={isLoadingUser}
                className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input resize-none")}
                autoComplete="off"
                rows={5}
                cols={40}
                spellCheck={false}
                id="favoritequote"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.currentTarget.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-y-1">
              <label htmlFor="email" className="ml-2 text-sm">
                Email
              </label>
              <input
                disabled={isLoadingUser}
                className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                autoComplete="off"
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setBasicInfoFormErrors(null);
                  setEmail(e.currentTarget.value);
                }}
              />
              {basicInfoFormErrors && basicInfoFormErrors.email && (
                <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                  {basicInfoFormErrors.email}
                </span>
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-end">
              <button
                type="submit"
                disabled={isLoadingUser || isPendingBasicInfo}
                className={clsx(
                  (isLoadingUser || isPendingBasicInfo) && "opacity-50",
                  "custom-button w-full md:w-auto",
                )}
              >
                {isPendingBasicInfo ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
          {/* SOCIAL LINKS */}
          <form onSubmit={handleUpdateSocialLinks} className="flex w-full flex-col gap-y-3">
            <div className="mb-3 flex w-full flex-row items-center justify-start">
              <h2 className="font-bold">Social Links</h2>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="facebook" className="ml-2 text-sm">
                  Facebook
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="facebook"
                  placeholder="Your facebook username"
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="instagram" className="ml-2 text-sm">
                  Instagram
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="instagram"
                  placeholder="Your instagram username"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="twitterx" className="ml-2 text-sm">
                  Twitter/X
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="twitterx"
                  placeholder="Your twitter/x username"
                  value={twitterxLink}
                  onChange={(e) => setTwitterxLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="twitterx" className="ml-2 text-sm">
                  Tiktok
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="twitterx"
                  placeholder="Your tiktok username"
                  value={tiktokLink}
                  onChange={(e) => setTiktokLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="linkedin" className="ml-2 text-sm">
                  LinkedIn
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="linkedin"
                  placeholder="Your linkedin username"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="github" className="ml-2 text-sm">
                  GitHub
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="github"
                  placeholder="Your github username"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="github" className="ml-2 text-sm">
                  Youtube
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="youtube"
                  placeholder="Your youtube channel link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="github" className="ml-2 text-sm">
                  Spotify
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="spotify"
                  placeholder="Your spotify playlist link"
                  value={spotifyLink}
                  onChange={(e) => setSpotifyLink(e.currentTarget.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="website" className="ml-2 text-sm">
                  Website
                </label>
                <input
                  disabled={isLoadingUser}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="text"
                  id="website"
                  placeholder="Website url"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="flex w-full flex-row items-center justify-end">
              <button
                disabled={isPendingSocialLinks}
                type="submit"
                className={clsx(
                  (isLoadingUser || isPendingSocialLinks) && "opacity-50",
                  "custom-button w-full md:w-auto",
                )}
              >
                {isPendingSocialLinks ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
          {/* CHANGE PASSWORD */}
          <form onSubmit={handleUpdatePassword} className="flex w-full flex-col gap-y-3">
            <div className="mb-3 flex w-full flex-row items-center justify-start">
              <h2 className="font-bold">Change Password</h2>
            </div>
            <div className="flex w-full flex-col gap-y-1">
              <label htmlFor="oldpassword" className="ml-2 text-sm">
                Old password
              </label>
              <input
                disabled={isPendingPassword}
                className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                autoComplete="off"
                type="password"
                id="oldpassword"
                value={oldPassword}
                onChange={(e) => {
                  setChangePasswordFormErrors(null);
                  setOldPassword(e.currentTarget.value);
                }}
              />
              {changePasswordFormErrors && changePasswordFormErrors.oldpassword && (
                <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                  {changePasswordFormErrors.oldpassword}
                </span>
              )}
            </div>
            <div className="flex w-full flex-col items-center gap-x-0 gap-y-3 md:flex-row md:items-start md:gap-x-3 md:gap-y-0">
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="newpassword" className="ml-2 text-sm">
                  New password
                </label>
                <input
                  disabled={isPendingPassword}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="password"
                  id="newpassword"
                  value={newPassword}
                  onChange={(e) => {
                    setChangePasswordFormErrors(null);
                    setNewPassword(e.currentTarget.value);
                  }}
                />
                {changePasswordFormErrors && changePasswordFormErrors.newpassword && (
                  <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                    {changePasswordFormErrors.newpassword}
                  </span>
                )}
              </div>
              <div className="flex w-full flex-col gap-y-1">
                <label htmlFor="repassword" className="ml-2 text-sm">
                  Re-type password
                </label>
                <input
                  disabled={isPendingPassword}
                  className={clsx(isLoadingUser && "cursor-not-allowed", "custom-input")}
                  autoComplete="off"
                  type="password"
                  id="repassword"
                  value={repassword}
                  onChange={(e) => {
                    setChangePasswordFormErrors(null);
                    setRepassword(e.currentTarget.value);
                  }}
                />
                {changePasswordFormErrors && changePasswordFormErrors.repassword && (
                  <span className="ml-2 mt-1 text-xs font-medium text-red-500">
                    {changePasswordFormErrors.repassword}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-full flex-row items-center justify-end">
              <button
                type="submit"
                disabled={isLoadingUser || isPendingPassword}
                className={clsx(
                  (isLoadingUser || isPendingPassword) && "opacity-50",
                  "custom-button w-full md:w-auto",
                )}
              >
                {isPendingPassword ? "Loading..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
