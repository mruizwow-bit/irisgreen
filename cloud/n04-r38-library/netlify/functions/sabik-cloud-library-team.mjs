import qaHandler from './sabik-cloud-library-qa.mjs';
import { createCloudLibraryTeamHandler } from '../../src/cloud-library-team-handler.mjs';

export default async (request, context) => createCloudLibraryTeamHandler({
  qaHandler,
  env: key => Netlify.env.get(key)
})(request, context);

export const config = { path: '/internal/n04/cloud-library/team/search' };
