import { api } from '../api/base-api';

export type CreatedUpload = {
  id: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

export const uploadsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUpload: builder.mutation<CreatedUpload, File>({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);

        return { url: '/uploads', method: 'POST', body };
      },
    }),
  }),
});

export const { useCreateUploadMutation } = uploadsApi;
