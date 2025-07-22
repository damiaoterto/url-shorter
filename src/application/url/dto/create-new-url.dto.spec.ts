import { CreateNewUrlDTO } from './create-new-url.dto';

describe('CreateNewUrlDTO', () => {
  it('should be able to create an instance and assign properties', () => {
    const dtoData = {
      url: 'https://example.com/very/long/url/to/shorten',
    };

    const dto = new CreateNewUrlDTO();
    dto.url = dtoData.url;

    expect(dto).toBeInstanceOf(CreateNewUrlDTO);
    expect(dto.url).toBe(dtoData.url);
  });
});
