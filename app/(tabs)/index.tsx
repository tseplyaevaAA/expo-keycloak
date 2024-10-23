import React, { useEffect, useState } from 'react';
import { Button, Text, View, Linking } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [authResult, setAuthResult] = useState<string | null>(null);

  const discovery = AuthSession.useAutoDiscovery(
    `https://identity-dev.etnasoft.us/realms/product-demoqa`
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'mobile',
      redirectUri: "com.etnatrader.tradermobile://callback",
      scopes: ['openid'],
      responseType: 'code',
      extraParams: {
        nonce: (Random.getRandomBytesAsync(16)).toString(),
      },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization code:', code);
      setAuthResult(code);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {authResult ? (
        <Text>Logged in with code: {authResult}</Text>
      ) : (
        <Button
          title="Login with Keycloak"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      )}
    </View>
  );
}

