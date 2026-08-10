import useCountUp from '../hooks/useCountUp';

export default function CountUp({ value, formatter = (n) => n, suffix = '' }) {
  const animated = useCountUp(value);
  return (
    <>
      {formatter(animated)}
      {suffix}
    </>
  );
}
