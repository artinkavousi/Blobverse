import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import metaSph from '@blobverse/physics-sph/metadata.json';
import metaRd from '@blobverse/field-rd/metadata.json';

export function ControlPanel() {
  // SPH controls
  const { h, k, mu, g } = useControls('SPH', metaSph.controls);
  // Colliders controls
  const { planeHeight, boxSize, boxY } = useControls('Colliders', {
    planeHeight: { value: -0.02, min: -0.3, max: 0.3, step: 0.01 },
    boxSize:     { value: 0.05, min: 0.02, max: 0.1, step: 0.005 },
    boxY:        { value: 0.15, min: 0.0, max: 0.3, step: 0.01 }
  });
  // Reaction-Diffusion controls
  const { feed, kill, diffA, diffB, rdDt } = useControls('Reaction-Diffusion', metaRd.controls);
  useStore.setState({ h, k, mu, g, planeHeight, boxSize, boxY, feed, kill, diffA, diffB, rdDt });
  return null;
} 