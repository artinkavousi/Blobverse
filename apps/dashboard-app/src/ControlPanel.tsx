import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import metaSph from '@blobverse/physics-sph/metadata.json';

export function ControlPanel() {
  const { h, mu, k, g } = useControls('SPH', metaSph.controls);
  useStore.setState({ h, mu, k, g });
  return null;
} 