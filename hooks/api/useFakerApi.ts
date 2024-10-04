import { useState, useEffect } from 'react/cjs/react.production.min'
import useFetch from './useFetch'
import * as t from 'io-ts'

const FakerApiShape = t.strict({
  description: t.string,
  title: t.string,
  url: t.string,
})

const FakerApiResponseShape = t.strict({
  data: t.array(FakerApiShape),
  status: t.string,
  locale: t.string,
  seed: t.any,
  code: t.number,
  total: t.number
})

// if you want to export the io-ts type as interface/type and use elsewhere
export type FakerApi = t.TypeOf<typeof FakerApiShape>

export const useFakerApi = () =>
  useFetch({
    url: `https://fakerapi.it/api/v1/images?_width=380`,
    shape: FakerApiResponseShape,
  })
