// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

export const getEventList = async (params: { [x: string]: any }) => {
  const { data } = await request('/rsc/tasks/events', {
    method: 'GET',
    params: { ...params },
  });
  return {
    data: data.list,
    success: true,
    total: data.total,
  };
};

export const getEventResult = () =>
  request('/rsc/tasks/events/result', {
    method: 'GET',
  });
