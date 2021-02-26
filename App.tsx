import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  block,
  clockRunning,
  cond,
  Easing,
  not,
  set,
  startClock,
  timing,
} from 'react-native-reanimated';

const PI_INTERVAL = Math.PI / 8;
const PI_CEIL = Math.ceil((2 * Math.PI) / PI_INTERVAL);

const withTiming = (clock: Animated.Clock, toValue: number) => {
  const state: Animated.TimingState = {
    finished: new Animated.Value<number>(0),
    frameTime: new Animated.Value<number>(0),
    position: new Animated.Value<number>(0),
    time: new Animated.Value<number>(0),
  };

  const config: Animated.TimingConfig = {
    duration: 1500,
    easing: Easing.inOut(Easing.linear),
    toValue: new Animated.Value<number>(toValue),
  };

  return block([
    cond(not(clockRunning(clock)), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.position, 0),
    ]),
    state.position,
  ]);
};

export default function App() {
  const clock = useRef(new Animated.Clock()).current;
  const progress = withTiming(clock, Math.PI * 2);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            alignItems: 'center',
            borderWidth: 10,
          },
          {
            // transform: [{ rotate: progress }],
          },
        ]}
      >
        {Array<number>(PI_CEIL)
          .fill(PI_INTERVAL)
          .map((element, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.petal,
                  { position: 'absolute' },
                  {
                    transform: [
                      { rotate: `${element * index}` },
                      { translateX: -200 / 2 },
                      { scaleX: 1.5 },
                      { scale: 1 },
                    ],
                  },
                ]}
              />
            );
          })}
      </Animated.View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'red',
  },
});
