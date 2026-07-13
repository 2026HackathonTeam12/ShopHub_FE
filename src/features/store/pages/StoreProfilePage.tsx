import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { StoreProfile } from '../../../data/store'
import { PageHeader } from '../../../components/common/PageHeader'

type StoreProfilePageProps = {
  store: StoreProfile
}

export function StoreProfilePage({ store }: StoreProfilePageProps) {
  const [saved, setSaved] = useState(false)
  const [menus, setMenus] = useState<string[]>(store.menu)
  const [newMenu, setNewMenu] = useState('')

  const removeMenu = (item: string) => {
    setMenus((current) => current.filter((m) => m !== item))
  }

  const addMenu = () => {
    const item = newMenu.trim()
    if (!item || menus.includes(item)) return
    setMenus((current) => [...current, item])
    setNewMenu('')
  }

  return (
    <>
      <PageHeader
        eyebrow="Store information"
        title="가게 정보"
        description="콘텐츠 AI와 고객 응대에 사용하는 가게의 기준 정보입니다."
        action={
          <button
            type="button"
            onClick={() => {
              setSaved(true)
              window.setTimeout(() => setSaved(false), 2800)
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
          >
            <Check size={16} />
            변경사항 저장
          </button>
        }
      />
      {saved && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between rounded-xl border border-[#9bdcc8] bg-[#eafaf5] px-4 py-3 text-sm font-semibold text-[#168165]"
        >
          가게 정보가 저장되었어요. 다음 AI 초안부터 반영됩니다.
          <Check size={17} />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#172033]">기본 프로필</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-[#42526e]">
              가게 이름
              <input
                defaultValue={store.name}
                className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
              />
            </label>
            <label className="block text-xs font-bold text-[#42526e]">
              행정구역
              <input
                defaultValue={store.neighborhood}
                className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
              />
            </label>
            <label className="block text-xs font-bold text-[#42526e]">
              상세 주소
              <input
                defaultValue={store.address}
                className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
              />
            </label>
            <label className="block text-xs font-bold text-[#42526e]">
              전화번호
              <input
                defaultValue={store.phone}
                className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
              />
            </label>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#172033]">대표 메뉴</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {menus.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1 rounded-lg bg-[#f3f0e9] pl-2.5 pr-1.5 py-1 text-xs font-bold text-[#172033]"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeMenu(item)}
                    className="rounded p-0.5 text-slate-400 hover:bg-[#ded9cf] hover:text-slate-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#eeeae2] flex items-end gap-2">
              <label htmlFor="new-menu" className="block text-xs font-bold text-[#42526e] flex-1">
                메뉴 또는 서비스 추가
                <input
                  id="new-menu"
                  value={newMenu}
                  onChange={(event) => setNewMenu(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addMenu()
                    }
                  }}
                  className="mt-1.5 w-full rounded-xl border border-[#ded9cf] px-3 py-2 text-sm outline-none focus:border-[#3dd7af]"
                  placeholder="추가할 항목 입력"
                />
              </label>
              <button
                type="button"
                onClick={addMenu}
                className="rounded-xl border border-[#ded9cf] bg-[#f7f5f0] px-3 py-2 text-xs font-bold text-[#29425b] hover:bg-[#ebe7df]"
              >
                추가
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
