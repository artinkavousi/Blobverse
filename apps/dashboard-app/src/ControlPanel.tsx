import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import metaSph from '@blobverse/physics-sph/metadata.json';

export function ControlPanel() {
  // Only update UI-controlled SPH parameters: h, k, mu, g
  const { h, k, mu, g } = useControls('SPH', metaSph.controls);
  useStore.setState({ h, k, mu, g });
  return null;
} 