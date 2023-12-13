"use client";

import Link from "next/link";
import Image from "next/image";

import facebook from "../../../public/svg/facebook.svg";
import instagram from "../../../public/svg/instagram.svg";
import twitter from "../../../public/svg/twitter.svg";
import tiktok from "../../../public/svg/tiktok.svg";
import linkedin from "../../../public/svg/linkedin.svg";
import github from "../../../public/svg/github.svg";
import youtube from "../../../public/svg/youtube.svg";
import spotify from "../../../public/svg/spotify.svg";

interface SocialMediaHolderProps {
  facebook_link: string | null;
  instagram_link: string | null;
  twitterx_link: string | null;
  tiktok_link: string | null;
  linkedin_link: string | null;
  github_link: string | null;
  youtube_link: string | null;
  spotify_link: string | null;
  website_link: string | null;
}

export default function SocialMediaHolder({
  facebook_link,
  instagram_link,
  twitterx_link,
  tiktok_link,
  linkedin_link,
  github_link,
  youtube_link,
  spotify_link,
  website_link,
}: SocialMediaHolderProps) {
  return (
    <div className="my-3 flex flex-row items-center gap-x-3">
      {facebook_link && (
        <Link
          href={`https://www.facebook.com/${facebook_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Facebook"
        >
          <Image
            priority
            src={facebook}
            alt="facebook"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {instagram_link && (
        <Link
          href={`https://www.instagram.com/${instagram_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Instagram"
        >
          <Image
            priority
            src={instagram}
            alt="instagram"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {tiktok_link && (
        <Link
          href={`https://www.tiktok.com/@${tiktok_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Tiktok"
        >
          <Image
            priority
            src={tiktok}
            alt="tiktok"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {twitterx_link && (
        <Link
          href={`https://twitter.com/${twitterx_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Twitter/X"
        >
          <Image
            priority
            src={twitter}
            alt="twitter"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {linkedin_link && (
        <Link
          href={`https://www.linkedin.com/in/${linkedin_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="LinkedIn"
        >
          <Image
            priority
            src={linkedin}
            alt="linkedin"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {github_link && (
        <Link
          href={`https://github.com/${github_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Github"
        >
          <Image
            priority
            src={github}
            alt="github"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {youtube_link && (
        <Link
          href={`${youtube_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Youtube"
        >
          <Image
            priority
            src={youtube}
            alt="youtube"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {spotify_link && (
        <Link
          href={`${spotify_link}`}
          target="_blank"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Spotify"
        >
          <Image
            priority
            src={spotify}
            alt="spotify"
            width={100}
            height={100}
            className="h-6 w-6 transform transition duration-200 ease-in-out hover:scale-125"
          />
        </Link>
      )}
      {website_link && (
        <Link
          href={website_link}
          target="_blank"
          aria-label="Website Link"
          data-tooltip-id="magaaazine-tooltip"
          data-tooltip-content="Website"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 transform text-neutral-400 transition duration-200 ease-in-out hover:scale-125"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Link>
      )}
    </div>
  );
}
