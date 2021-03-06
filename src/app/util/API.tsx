interface WindowInterface {
  Magnolia: any;
}
declare let window: WindowInterface;

export const path = () => {
  return window.Magnolia.uri_api_path;
};

export const camera = () => {
  return window.Magnolia.uri_camera_path;
};

export const cookieDomain = () => {
  return window.Magnolia.cookie_domain;
};

export const call = (uri: string, method: string = "GET", body: object = {}): Promise<Response> => {
  const options: any = {
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'X-Auth-Key': window.Magnolia.auth_key,
    },
  };
  if (method === 'POST') {
    options.method = method;
    options.headers['Content-Type'] = 'application/json; charset=utf-8';
    options.body = JSON.stringify(body);
  }
  return fetch(`${path()}${uri}`, options);
};
