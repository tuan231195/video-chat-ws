import { createContext, useContext } from 'react';
import { MediaStreamService } from 'src/services/media-stream.service';

export const MediaContext = createContext<MediaStreamService>(null as any);

export const useMediaStream = () => useContext(MediaContext);
