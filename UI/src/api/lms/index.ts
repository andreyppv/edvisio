import axios from "axios";
import { getRequester } from "./requester";
import baseUrl from "../../app.config";

// Gets the User info
export async function getUserInfo() {
  let response: any = { data: null, error: null };
  try {
    response = await getRequester().get(`${baseUrl}/ApiGetUserInfo`);
  } catch (error) {
    response.error = error;
  }
  return response;
}
