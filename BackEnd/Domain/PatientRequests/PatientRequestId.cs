using System;
using BackEnd.Domain.Shared;
using Newtonsoft.Json;

namespace BackEnd.Domain.PatientRequests
{
    [method: JsonConstructor]
    public class PatientRequestId(int value) : EntityId(value), IConvertible
    {
        override
        protected Object createFromString(string text)
        {
            return Int32.Parse(text);
        }

        override
        public string AsString()
        {
            int obj = (int)base.ObjValue;
            return obj.ToString();
        }

        public TypeCode GetTypeCode()
        {
            return Type.GetTypeCode(base.ObjValue.GetType());
        }

        public bool ToBoolean(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public byte ToByte(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public char ToChar(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public DateTime ToDateTime(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public decimal ToDecimal(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public double ToDouble(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public short ToInt16(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public int ToInt32(IFormatProvider provider)
        {
            return Convert.ToInt32(base.ObjValue);
        }

        public long ToInt64(IFormatProvider provider)
        {
            return Convert.ToInt64(base.ObjValue);
        }

        public sbyte ToSByte(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public float ToSingle(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public string ToString(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public object ToType(Type conversionType, IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public ushort ToUInt16(IFormatProvider provider)
        {
            throw new NotImplementedException();
        }

        public uint ToUInt32(IFormatProvider provider)
        {
            return Convert.ToUInt32(base.ObjValue);
        }

        public ulong ToUInt64(IFormatProvider provider)
        {
            return Convert.ToUInt64(base.ObjValue);
        }
    }
}