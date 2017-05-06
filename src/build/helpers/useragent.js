const getOS = () => {
  return (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
};

export const isMac = () => getOS() === "mac";