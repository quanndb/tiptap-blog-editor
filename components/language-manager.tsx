"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Trash2, Globe, Star } from "lucide-react"
import type { LanguageVersion } from "./blog-editor"

interface LanguageManagerProps {
  isOpen: boolean
  onClose: () => void
  languages: LanguageVersion[]
  currentLanguage: string
  onAddLanguage: (language: LanguageVersion) => void
  onUpdateLanguage: (code: string, language: LanguageVersion) => void
  onDeleteLanguage: (code: string) => void
  onSwitchLanguage: (code: string) => void
}

const commonLanguages = [
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
]

export function LanguageManager({
  isOpen,
  onClose,
  languages,
  currentLanguage,
  onAddLanguage,
  onUpdateLanguage,
  onDeleteLanguage,
  onSwitchLanguage,
}: LanguageManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    code: "",
    name: "",
    nativeName: "",
    flag: "",
  })

  if (!isOpen) return null

  const handleAddLanguage = () => {
    if (!newLanguage.code || !newLanguage.name) return

    const languageVersion: LanguageVersion = {
      ...newLanguage,
      sections: [], // Start with empty sections
    }

    onAddLanguage(languageVersion)
    setNewLanguage({ code: "", name: "", nativeName: "", flag: "" })
    setShowAddForm(false)
  }

  const handleAddCommonLanguage = (lang: (typeof commonLanguages)[0]) => {
    if (languages.some((l) => l.code === lang.code)) return

    const languageVersion: LanguageVersion = {
      ...lang,
      sections: [], // Start with empty sections
    }

    onAddLanguage(languageVersion)
  }

  const setAsDefault = (code: string) => {
    languages.forEach((lang) => {
      onUpdateLanguage(lang.code, { ...lang, isDefault: lang.code === code })
    })
  }

  const availableCommonLanguages = commonLanguages.filter((lang) => !languages.some((l) => l.code === lang.code))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language Manager
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Languages */}
          <div>
            <h3 className="text-lg font-medium mb-4">Current Languages</h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    lang.code === currentLanguage ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lang.name}</span>
                        {lang.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <Star className="w-3 h-3" />
                            Default
                          </span>
                        )}
                        {lang.code === currentLanguage && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Current</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lang.nativeName} ({lang.code}) • {lang.sections.length} sections
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lang.code !== currentLanguage && (
                      <Button onClick={() => onSwitchLanguage(lang.code)} size="sm" variant="outline">
                        Switch
                      </Button>
                    )}
                    {!lang.isDefault && (
                      <Button onClick={() => setAsDefault(lang.code)} size="sm" variant="outline">
                        Set Default
                      </Button>
                    )}
                    {languages.length > 1 && (
                      <Button
                        onClick={() => onDeleteLanguage(lang.code)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Common Languages */}
          {availableCommonLanguages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Add Common Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableCommonLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => handleAddCommonLanguage(lang)}
                    variant="outline"
                    className="flex items-center gap-2 p-3 h-auto justify-start"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{lang.name}</div>
                      <div className="text-xs text-gray-500">{lang.nativeName}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Language */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add Custom Language</h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? "Cancel" : "Add Custom"}
              </Button>
            </div>

            {showAddForm && (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="langCode">Language Code *</Label>
                    <Input
                      id="langCode"
                      value={newLanguage.code}
                      onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value.toLowerCase() })}
                      placeholder="e.g., en, vi, zh"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="langName">English Name *</Label>
                    <Input
                      id="langName"
                      value={newLanguage.name}
                      onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                      placeholder="e.g., Vietnamese"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nativeName">Native Name</Label>
                    <Input
                      id="nativeName"
                      value={newLanguage.nativeName}
                      onChange={(e) => setNewLanguage({ ...newLanguage, nativeName: e.target.value })}
                      placeholder="e.g., Tiếng Việt"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <Input
                      id="flag"
                      value={newLanguage.flag}
                      onChange={(e) => setNewLanguage({ ...newLanguage, flag: e.target.value })}
                      placeholder="e.g., 🇻🇳"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleAddLanguage} size="sm" disabled={!newLanguage.code || !newLanguage.name}>
                    Add Language
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}
