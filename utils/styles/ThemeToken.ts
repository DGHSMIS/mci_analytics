import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

export const tokens = (isDarkMode: boolean = false) => {
  const fullTwConfig = resolveConfig(tailwindConfig);
  if (!fullTwConfig || !fullTwConfig.theme || !fullTwConfig.theme.colors)
    return {};

  const colors:any = fullTwConfig.theme.colors;

  return {
    ...(isDarkMode
      ? {
          grey: colors.grey,
          primary: colors.primary,
          secondary: colors.secondary,
          navBg: colors.navBg,
          navText: colors.navText,
          navActiveLink: colors.navActiveLink,
          navActiveLinkText: colors.navActiveLinkText,
          navHover: colors.navHover,
          navMenu: colors.navMenu,
          cream: colors.cream,
          peach: colors.peach,
          facebook: colors.facebook,
          facebookold: colors.facebookold,
          twitter: colors.twitter,
          youtube: colors.youtube,
          instagrammagenta: colors.instagrammagenta,
          instagramblue: colors.instagramblue,
          instagrampurple: colors.instagrampurple,
          instagramorange: colors.instagramorange,
          instagramyellow: colors.instagramyellow,
          googleblue: colors.googleblue,
          googlered: colors.googlered,
          googleyellow: colors.googleyellow,
          googlegreen: colors.googlegreen,
          pinterest: colors.pinterest,
          googleplus: colors.googleplus,
          linkedin: colors.linkedin,
          vimeoblue: colors.vimeoblue,
          tumblr: colors.tumblr,
          snapchat: colors.snapchat,
          whatsappgreen: colors.whatsappgreen,
          whatsappteal1: colors.whatsappteal1,
          whatsappteal2: colors.whatsappteal2,
          tiktokblack: colors.tiktokblack,
          tiktookblue: colors.tiktookblue,
          tiktokpink: colors.tiktokpink,
          tiktokwhite: colors.tiktokwhite,
          mastodon: colors.mastodon,
          apple: colors.apple,
          amazon: colors.amazon,
          alexablue: colors.alexablue,
          alexadkblue: colors.alexadkblue,
          microsoftred: colors.microsoftred,
          microsoftgreen: colors.microsoftgreen,
          microsoftblue: colors.microsoftblue,
          microsoftyellow: colors.microsoftyellow,
          periscope: colors.periscope,
          foursquarepink: colors.foursquarepink,
          foursquarenavy: colors.foursquarenavy,
          foursquareblue: colors.foursquareblue,
          yelp: colors.yelp,
          swarm: colors.swarm,
          medium: colors.medium,
          skypeblue: colors.skypeblue,
          skypedkblue: colors.skypedkblue,
          android: colors.android,
          stumbleupon: colors.stumbleupon,
          flickrpink: colors.flickrpink,
          flickrblue: colors.flickrblue,
          yahoo: colors.yahoo,
          twitch: colors.twitch,
          soundcloud: colors.soundcloud,
          spotifygreen: colors.spotifygreen,
          spotifydarkgreen: colors.spotifydarkgreen,
          dribbble: colors.dribbble,
          slackpurple: colors.slackpurple,
          slackblue: colors.slackblue,
          slackgreen: colors.slackgreen,
          slackred: colors.slackred,
          slackyellow: colors.slackyellow,
          reddit: colors.reddit,
          deviantart: colors.deviantart,
          pocket: colors.pocket,
          quora: colors.quora,
          quorablue: colors.quorablue,
          slideshareorange: colors.slideshareorange,
          slideshareblue: colors.slideshareblue,
          fivehundredpx: colors.fivehundredpx,
          vk: colors.vk,
          listlyorange: colors.listlyorange,
          listlyblue: colors.listlyblue,
          vine: colors.vine,
          steam: colors.steam,
          discord: colors.discord,
          telegram: colors.telegram,
          clarity: colors.clarity,
          homeadvisor: colors.homeadvisor,
          houzz: colors.houzz,
          angi: colors.angi,
          glassdoor: colors.glassdoor,
          // ... other colors
        }
      : {
          grey: colors.grey,
          primary: colors.primary,
          secondary: colors.secondary,
          navBg: colors.navBg,
          navText: colors.navText,
          navActiveLink: colors.navActiveLink,
          navActiveLinkText: colors.navActiveLinkText,
          navHover: colors.navHover,
          navMenu: colors.navMenu,
          cream: colors.cream,
          peach: colors.peach,
          facebook: colors.facebook,
          facebookold: colors.facebookold,
          twitter: colors.twitter,
          youtube: colors.youtube,
          instagrammagenta: colors.instagrammagenta,
          instagramblue: colors.instagramblue,
          instagrampurple: colors.instagrampurple,
          instagramorange: colors.instagramorange,
          instagramyellow: colors.instagramyellow,
          googleblue: colors.googleblue,
          googlered: colors.googlered,
          googleyellow: colors.googleyellow,
          googlegreen: colors.googlegreen,
          pinterest: colors.pinterest,
          googleplus: colors.googleplus,
          linkedin: colors.linkedin,
          vimeoblue: colors.vimeoblue,
          tumblr: colors.tumblr,
          snapchat: colors.snapchat,
          whatsappgreen: colors.whatsappgreen,
          whatsappteal1: colors.whatsappteal1,
          whatsappteal2: colors.whatsappteal2,
          tiktokblack: colors.tiktokblack,
          tiktookblue: colors.tiktookblue,
          tiktokpink: colors.tiktokpink,
          tiktokwhite: colors.tiktokwhite,
          mastodon: colors.mastodon,
          apple: colors.apple,
          amazon: colors.amazon,
          alexablue: colors.alexablue,
          alexadkblue: colors.alexadkblue,
          microsoftred: colors.microsoftred,
          microsoftgreen: colors.microsoftgreen,
          microsoftblue: colors.microsoftblue,
          microsoftyellow: colors.microsoftyellow,
          periscope: colors.periscope,
          foursquarepink: colors.foursquarepink,
          foursquarenavy: colors.foursquarenavy,
          foursquareblue: colors.foursquareblue,
          yelp: colors.yelp,
          swarm: colors.swarm,
          medium: colors.medium,
          skypeblue: colors.skypeblue,
          skypedkblue: colors.skypedkblue,
          android: colors.android,
          stumbleupon: colors.stumbleupon,
          flickrpink: colors.flickrpink,
          flickrblue: colors.flickrblue,
          yahoo: colors.yahoo,
          twitch: colors.twitch,
          soundcloud: colors.soundcloud,
          spotifygreen: colors.spotifygreen,
          spotifydarkgreen: colors.spotifydarkgreen,
          dribbble: colors.dribbble,
          slackpurple: colors.slackpurple,
          slackblue: colors.slackblue,
          slackgreen: colors.slackgreen,
          slackred: colors.slackred,
          slackyellow: colors.slackyellow,
          reddit: colors.reddit,
          deviantart: colors.deviantart,
          pocket: colors.pocket,
          quora: colors.quora,
          quorablue: colors.quorablue,
          slideshareorange: colors.slideshareorange,
          slideshareblue: colors.slideshareblue,
          fivehundredpx: colors.fivehundredpx,
          vk: colors.vk,
          listlyorange: colors.listlyorange,
          listlyblue: colors.listlyblue,
          vine: colors.vine,
          steam: colors.steam,
          discord: colors.discord,
          telegram: colors.telegram,
          clarity: colors.clarity,
          homeadvisor: colors.homeadvisor,
          houzz: colors.houzz,
          angi: colors.angi,
          glassdoor: colors.glassdoor,
          // ... other colors
        }),
  };
};
