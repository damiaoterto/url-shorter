import { UpdateUrlDTO } from './update-url.dto';

describe('UpdateUrlDTO', () => {
  it('should be able to create an instance and assign properties', () => {
    const dtoData = {
      url: 'https://new-example.com/some/path',
    };

    const dto = new UpdateUrlDTO();
    dto.url = dtoData.url;

    expect(dto).toBeInstanceOf(UpdateUrlDTO);
    expect(dto.url).toBe(dtoData.url);
  });

  it('should have undefined properties if they are not provided', () => {
    const dto = new UpdateUrlDTO();

    expect(dto).toBeInstanceOf(UpdateUrlDTO);
    expect(dto.url).toBeUndefined();
  });
});
