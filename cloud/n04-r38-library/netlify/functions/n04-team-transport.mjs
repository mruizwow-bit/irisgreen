import qaHandler from './n04-library-qa.mjs';
import { createTeamTransportHandler } from '../../src/team-transport-handler.mjs';
export default async (request, context) => createTeamTransportHandler({
  qaHandler, env: key => Netlify.env.get(key),
})(request, context);
export const config = { path: ['/sabik-connect', '/internal/n04/team/search'] };
