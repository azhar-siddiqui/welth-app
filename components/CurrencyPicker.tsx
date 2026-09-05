import { Feather } from "@expo/vector-icons";
import { hasFlag } from "country-flag-icons";
import cc from "currency-codes";
import getSymbol from "currency-symbol-map";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CurrencyEntry = {
  code: string;
  name: string;
  symbol: string;
  countryCode: string | null;
};

function getCountryCode(currencyCode: string): string | null {
  const iso = currencyCode.slice(0, 2);
  return hasFlag(iso) ? iso : null;
}

function flagUri(countryCode: string) {
  return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
}

export const ALL_CURRENCIES: CurrencyEntry[] = cc
  .codes()
  .map((code) => ({
    code,
    name: cc.code(code)?.currency ?? code,
    symbol: getSymbol(code) ?? code,
    countryCode: getCountryCode(code),
  }))
  .filter((c) => c.symbol !== c.code); // drop ones with no real symbol

export function FlagWithSymbol({
  countryCode,
  symbol,
}: {
  countryCode: string | null;
  symbol: string;
}) {
  return (
    <View className="w-16 flex-row items-center gap-2">
      {countryCode ? (
        <Image
          source={{ uri: flagUri(countryCode) }}
          accessibilityLabel={`${countryCode} flag`}
          className="bg-[#F0EDE6]"
          style={{ width: 22, height: 15 }}
          resizeMode="cover"
        />
      ) : (
        <View className="bg-[#E8E6DF]" style={{ width: 22, height: 15 }} />
      )}
      <Text className="text-brand-text-secondary text-sm">{symbol}</Text>
    </View>
  );
}

export function CurrencyPicker({
  visible,
  selectedCode,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedCode: string;
  onSelect: (currency: CurrencyEntry) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
        <View className="flex-row items-center px-5 pt-3 pb-2 gap-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search currency…"
            placeholderTextColor="#8A8D96"
            autoFocus
            className="flex-1 bg-white border border-[#E8E6DF] rounded-full px-4 py-2.5 text-sm text-brand-bg"
          />
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              onClose();
            }}
          >
            <Text className="text-brand-text-secondary text-sm">Cancel</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setSearch("");
              }}
              className="flex-row items-center px-5 py-3.5 border-b border-[#F0EDE6] gap-4"
            >
              <FlagWithSymbol
                countryCode={item.countryCode}
                symbol={item.symbol}
              />
              <Text className="text-brand-bg text-sm font-medium w-12">
                {item.code}
              </Text>
              <Text
                className="text-brand-text-secondary text-sm flex-1"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.code === selectedCode && (
                <Feather name="check" size={16} color="#4A9EFF" />
              )}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}
